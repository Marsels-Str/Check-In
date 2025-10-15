<?php

namespace App\Http\Controllers;

use App\Models\Map;
use App\Models\User;
use Inertia\Inertia;
use App\Models\JobGroup;
use App\Models\Business;
use Illuminate\Http\Request;

class JobGroupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('Owner')) {
            $jobGroups = JobGroup::with('business')->get();
        } elseif ($user->hasRole('Business') && $user->ownedBusiness) {
            $jobGroups = JobGroup::with('business')
                ->where('business_id', $user->ownedBusiness->id)
                ->get();
        } elseif ($user->hasRole('Worker')) {
            $businessIds = $user->businesses()->pluck('business_id');
            $jobGroups = JobGroup::whereIn('business_id', $businessIds)
                ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
                ->with('business')
                ->get();
        } else {
            $jobGroups = collect();
        }

        return Inertia::render('job-groups/index', [
            'jobGroups' => $jobGroups,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $businesses = collect();

        if ($user->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
        } elseif ($user->hasRole('Business') && $user->ownedBusiness) {
            $businesses = collect([$user->ownedBusiness]);
        } elseif ($user->hasRole('Worker')) {
            $businesses = $user->businesses()->select('businesses.id', 'businesses.name')->get();
        }

        return Inertia::render('job-groups/create', [
            'businesses' => $businesses,
            'auth' => [
                'user' => $user->load('roles', 'ownedBusiness', 'businesses'),
            ],
        ]);
    }

    public function attachMap(Request $request, $jobGroupId)
    {
        $jobGroup = JobGroup::findOrFail($jobGroupId);

        $request->validate([
            'map_id' => 'required|exists:maps,id',
        ]);

        $map = Map::findOrFail($request->map_id);

        if ($map->business_id !== $jobGroup->business_id) {
            return back();
        }

        Map::where('job_group_id', $jobGroup->id)->update(['job_group_id' => null]);

        $map->job_group_id = $jobGroup->id;
        $map->save();

        return redirect()->route('job-groups.show', $jobGroup->id);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'        => 'required|string|max:50',
            'description' => 'nullable|string',
            'business_id' => $user->hasRole('Owner') ? 'required|exists:businesses,id' : 'nullable',
        ]);

        if ($user->hasRole('Owner')) {
            $businessId = $request->input('business_id');
        } elseif ($user->hasRole('Business') && $user->ownedBusiness) {
            $businessId = $user->ownedBusiness->id;
        } elseif ($user->hasRole('Worker')) {
            $businessId = $user->businesses()->pluck('businesses.id')->first();
        } else {
            $businessId = null;
        }

        if (! $businessId) {
            return redirect()->route('job-groups.index');
        }

        JobGroup::create([
            'name'        => $request->name,
            'description' => $request->description,
            'business_id' => $businessId,
        ]);

        return redirect()->route('job-groups.index');
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();

        $group = JobGroup::with(['users', 'images:id,job_group_id,image_blob', 'map', 'business'])
            ->findOrFail($id);

        if ($user->hasRole('Owner')) {
        } elseif ($user->hasRole('Business')) {
            if (! $user->ownedBusiness || $group->business_id !== $user->ownedBusiness->id) {
                return redirect()->route('job-groups.index');
            }
        } elseif ($user->hasRole('Worker')) {
            $isMember = $group->users->contains('id', $user->id);
            if (! $isMember) {
                return redirect()->route('job-groups.index');
            }
        } else {
            return redirect()->route('job-groups.index');
        }

        $availableUsers = User::whereHas('businesses', function ($q) use ($group) {
            $q->where('businesses.id', $group->business_id);
        })
            ->whereNotIn('id', $group->users->pluck('id'))
            ->get();

        $availableMaps = Map::where('business_id', $group->business_id)->get();

        return Inertia::render('job-groups/show', [
            'group'         => $group,
            'users'         => $availableUsers,
            'availableMaps' => $availableMaps,
        ]);
    }

    public function edit(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $user->hasRole('Owner')) {
            $allowedBusinessIds = collect();

            if ($user->hasRole('Business') && $user->ownedBusiness) {
                $allowedBusinessIds->push($user->ownedBusiness->id);
            }

            if ($user->hasRole('Worker')) {
                $allowedBusinessIds = $user->businesses()->pluck('businesses.id');
            }

            if (! $allowedBusinessIds->contains($group->business_id)) {
                return redirect()->route('job-groups.index');
            }
        }

        return Inertia::render('job-groups/edit', ['group' => $group]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name'        => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $user->hasRole('Owner')) {
            $allowedBusinessIds = $user->hasRole('Business') && $user->ownedBusiness
                ? collect([$user->ownedBusiness->id])
                : $user->businesses()->pluck('businesses.id');

            if (! $allowedBusinessIds->contains($group->business_id)) {
                return redirect()->route('job-groups.index');
            }
        }

        $group->update([
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('job-groups.index');
    }

    public function updateUsers(Request $request, JobGroup $group)
    {
        $authUser = $request->user();

        if (
            ! $authUser->hasRole('Owner') &&
            ! ($authUser->hasRole('Business') && $authUser->ownedBusiness && $authUser->ownedBusiness->id === $group->business_id)
        ) {
            return redirect()->back();
        }

        $validated = $request->validate([
            'user_ids'   => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $allowedUserIds = User::whereHas('businesses', function ($q) use ($group) {
            $q->where('businesses.id', $group->business_id);
        })
            ->whereIn('id', $validated['user_ids'] ?? [])
            ->pluck('id')
            ->toArray();

        $group->users()->syncWithoutDetaching($allowedUserIds);

        return redirect()->route('job-groups.show', $group->id);
    }

    public function removeUser(Request $request, JobGroup $group, User $user)
    {
        $authUser = $request->user();

        if (
            ! $authUser->hasRole('Owner') &&
            ! ($authUser->hasRole('Business') && $authUser->ownedBusiness && $authUser->ownedBusiness->id === $group->business_id)
        ) {
            return redirect()->back();
        }

        if ($group->users()->where('users.id', $user->id)->exists()) {
            $group->users()->detach($user->id);
        }

        return redirect()->back();
    }

    public function destroy(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $user->hasRole('Owner')) {
            $allowedBusinessIds = $user->hasRole('Business') && $user->ownedBusiness
                ? collect([$user->ownedBusiness->id])
                : $user->businesses()->pluck('businesses.id');

            if (! $allowedBusinessIds->contains($group->business_id)) {
                return redirect()->route('job-groups.index');
            }
        }

        $group->delete();

        return redirect()->route('job-groups.index');
    }
}

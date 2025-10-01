<?php

namespace App\Http\Controllers;

use App\Models\JobGroup;
use App\Models\User;
use App\Models\Map;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        } elseif ($user->hasRole('Worker') && $user->business_id) {
            $jobGroups = JobGroup::whereHas('users', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                })
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
        return Inertia::render('job-groups/create');
    }

    public function attachMap(Request $request, $jobGroupId)
    {
        $jobGroup = JobGroup::findOrFail($jobGroupId);

        $request->validate([
            'map_id' => 'required|exists:maps,id',
        ]);

        $map = Map::findOrFail($request->map_id);

        if ($map->business_id !== $jobGroup->business_id) {
            return back()->withErrors(['map_id' => 'This map does not belong to the same business as the group.']);
        }

        Map::where('job_group_id', $jobGroup->id)->update(['job_group_id' => null]);

        $map->job_group_id = $jobGroup->id;
        $map->save();

        return redirect()->route('job-groups.show', $jobGroup->id)
            ->with('success', 'Map attached successfully.');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'        => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        if ($user->hasRole('Owner')) {
            $businessId = $request->input('business_id');
        } else {
            $businessId = $user->hasRole('Business')
                ? optional($user->ownedBusiness)->id
                : $user->business_id;
        }

        if (! $businessId) {
            return redirect()->route('job-groups.index')
                ->with('error', 'No business resolved for this action.');
        }

        JobGroup::create([
            'name'        => $request->name,
            'description' => $request->description,
            'business_id' => $businessId,
        ]);

        return redirect()->route('job-groups.index')
            ->with('success', 'Group created.');
    }

    public function show(Request $request, string $id)
    {
        $user  = $request->user();
        $group = JobGroup::with(['users', 'images:id,job_group_id,image_blob', 'map', 'business'])
            ->findOrFail($id);

        if ($user->hasRole('Owner')) {
        } elseif ($user->hasRole('Business')) {
            if (! $user->ownedBusiness || $group->business_id !== $user->ownedBusiness->id) {
                return redirect()->route('job-groups.index')
                    ->with('error', 'This group is not in your business.');
            }
        } elseif ($user->hasRole('Worker')) {
            $isMember = $group->users->contains('id', $user->id);
            if (! $isMember) {
                return redirect()->route('job-groups.index')
                    ->with('error', 'You are not a member of this group.');
            }
        } else {
            return redirect()->route('job-groups.index')
                ->with('error', 'You do not have access.');
        }

        $availableUsers = User::where('business_id', $group->business_id)
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
            $bizId = $user->hasRole('Business') ? optional($user->ownedBusiness)->id : $user->business_id;
            if (! $bizId || $group->business_id !== $bizId) {
                return redirect()->route('job-groups.index')
                    ->with('error', 'This group is not in your business.');
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
            $bizId = $user->hasRole('Business') ? optional($user->ownedBusiness)->id : $user->business_id;
            if (! $bizId || $group->business_id !== $bizId) {
                return redirect()->route('job-groups.index')
                    ->with('error', 'This group is not in your business.');
            }
        }

        $group->update([
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('job-groups.index')->with('success', 'Group updated.');
    }

    public function updateUsers(Request $request, JobGroup $group)
    {
        $authUser = $request->user();

        if (
            ! $authUser->hasRole('Owner') &&
            ! ($authUser->hasRole('Business') && $authUser->ownedBusiness && $authUser->ownedBusiness->id === $group->business_id)
        ) {
            return redirect()->back()->with('error', 'You do not have permission to manage users for this group.');
        }

        $validated = $request->validate([
            'user_ids'   => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $allowedUserIds = User::where('business_id', $group->business_id)
            ->whereIn('id', $validated['user_ids'] ?? [])
            ->pluck('id')
            ->toArray();

        $group->users()->syncWithoutDetaching($allowedUserIds);

        return redirect()->route('job-groups.show', $group->id)
            ->with('success', 'Employee(s) added to group.');
    }

    public function removeUser(Request $request, JobGroup $group, User $user)
    {
        $authUser = $request->user();

        if (
            ! $authUser->hasRole('Owner') &&
            ! ($authUser->hasRole('Business') && $authUser->ownedBusiness && $authUser->ownedBusiness->id === $group->business_id)
        ) {
            return redirect()->back()->with('error', 'You do not have permission to remove users from this group.');
        }

        if ($group->users()->where('users.id', $user->id)->exists()) {
            $group->users()->detach($user->id);
        }

        return redirect()->back()->with('success', 'User removed from group.');
    }

    public function destroy(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);

        $user = $request->user();
        if (! $user->hasRole('Owner')) {
            $bizId = $user->hasRole('Business') ? optional($user->ownedBusiness)->id : $user->business_id;
            if (! $bizId || $group->business_id !== $bizId) {
                return redirect()->route('job-groups.index')
                    ->with('error', 'This group is not in your business.');
            }
        }

        $group->delete();

        return redirect()->route('job-groups.index')->with('success', 'Group deleted.');
    }
}

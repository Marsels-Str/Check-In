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

        $jobGroups = match (true) {
            $user->hasRole('Owner') =>
                JobGroup::with('business')->get(),

            $user->hasRole('Business') && $user->ownedBusiness =>
                JobGroup::with('business')
                    ->where('business_id', $user->ownedBusiness->id)
                    ->get(),

            $user->hasRole('Worker') =>
                JobGroup::whereIn('business_id', $user->businesses()->pluck('business_id'))
                    ->whereHas('users', fn($q) => $q->where('users.id', $user->id))
                    ->with('business')
                    ->get(),

            default => collect(),
        };

        return Inertia::render('job-groups/index', compact('jobGroups'));
    }

    public function create(Request $request)
    {
        $user = $request->user();

        $businesses = match (true) {
            $user->hasRole('Owner') =>
                Business::select('id', 'name')->orderBy('name')->get(),
            $user->hasRole('Business') && $user->ownedBusiness =>
                collect([$user->ownedBusiness]),
            $user->hasRole('Worker') =>
                $user->businesses()->select('businesses.id', 'businesses.name')->get(),
            default => collect(),
        };

        return Inertia::render('job-groups/create', [
            'businesses' => $businesses,
            'auth' => [
                'user' => $user->load('roles', 'ownedBusiness', 'businesses'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'        => 'required|string|max:50',
            'description' => 'nullable|string',
            'business_id' => $user->hasRole('Owner') ? 'required|exists:businesses,id' : 'nullable',
        ]);

        $businessId = $this->resolveBusinessId($user, $request->input('business_id'));

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

        if (! $this->ensureAuthorizedForGroup($user, $group)) {
            return redirect()->route('job-groups.index');
        }

        $availableUsers = User::whereHas('businesses', fn($q) =>
            $q->where('businesses.id', $group->business_id)
        )
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
        $user = $request->user();
        $group = JobGroup::findOrFail($id);

        if (! $this->ensureAuthorizedForGroup($user, $group)) {
            return redirect()->route('job-groups.index');
        }

        return Inertia::render('job-groups/edit', ['group' => $group]);
    }

    public function update(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group)) {
            return redirect()->route('job-groups.index');
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('job-groups.index');
    }

    public function destroy(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group)) {
            return redirect()->route('job-groups.index');
        }

        $group->delete();

        return redirect()->route('job-groups.index');
    }

    public function attachMap(Request $request, JobGroup $jobGroup)
    {
        $data = $request->validate(['map_id' => 'required|exists:maps,id']);
        $map = Map::findOrFail($data['map_id']);

        if ($map->business_id !== $jobGroup->business_id) {
            return back();
        }

        Map::where('job_group_id', $jobGroup->id)->update(['job_group_id' => null]);
        $map->update(['job_group_id' => $jobGroup->id]);

        return redirect()->route('job-groups.show', $jobGroup->id);
    }

    public function updateUsers(Request $request, JobGroup $group)
    {
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group)) {
            return back();
        }

        $validated = $request->validate([
            'user_ids'   => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $allowedUserIds = User::whereHas('businesses', fn($q) =>
            $q->where('businesses.id', $group->business_id)
        )
            ->whereIn('id', $validated['user_ids'] ?? [])
            ->pluck('id')
            ->toArray();

        $group->users()->syncWithoutDetaching($allowedUserIds);

        return redirect()->route('job-groups.show', $group->id);
    }

    public function removeUser(Request $request, JobGroup $group, User $user)
    {
        $authUser = $request->user();

        if (! $this->ensureAuthorizedForGroup($authUser, $group)) {
            return back();
        }

        if ($group->users()->where('users.id', $user->id)->exists()) {
            $group->users()->detach($user->id);
        }

        return back();
    }

    private function resolveBusinessId($user, $inputId = null)
    {
        return match (true) {
            $user->hasRole('Owner')    => $inputId,
            $user->hasRole('Business') => $user->ownedBusiness?->id,
            $user->hasRole('Worker')   => $user->businesses()->value('businesses.id'),
            default                    => null,
        };
    }

    private function ensureAuthorizedForGroup($user, JobGroup $group): bool
    {
        if ($user->hasRole('Owner')) {
            return true;
        }

        $allowedBusinessIds = $user->hasRole('Business') && $user->ownedBusiness
            ? collect([$user->ownedBusiness->id])
            : $user->businesses()->pluck('businesses.id');

        return $allowedBusinessIds->contains($group->business_id);
    }
}

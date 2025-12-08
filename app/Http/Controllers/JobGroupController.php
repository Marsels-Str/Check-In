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
            $user->hasRole('Owner') => JobGroup::with('business')->get(),
            
            $user->can('groups.view') && $user->hasRole('Business') && $user->ownedBusiness =>
                JobGroup::with('business')
                    ->where('business_id', $user->ownedBusiness->id)
                    ->get(),
            
            $user->can('groups.view') =>
                JobGroup::whereHas('users',  fn($q) => $q->where('users.id', $user->id))
                    ->whereIn('business_id', $user->businesses()->pluck('businesses.id'))
                    ->with('business')
                    ->get(),
            
            default => collect(),
        };

        return Inertia::render('job-groups/index', compact('jobGroups'));
    }

    public function create(Request $request)
    {
        $user = $request->user();

        if (! $user->can('groups.create')) {
            return back();
        }

        $businesses = match (true) {
            $user->hasRole('Owner') => Business::select('id', 'name')->orderBy('name')->get(),
            $user->hasRole('Business') && $user->ownedBusiness => collect([$user->ownedBusiness]),
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

        if (! $user->can('groups.create')) {
            return back();
        }

        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
            'business_id' => $user->hasRole('Owner') ? 'required|exists:businesses,id' : 'nullable',
        ]);

        $businessId = $this->resolveBusinessId($user, $request->input('business_id'));
        if (!$businessId) {
            return back();
        }

        JobGroup::create([
            'name' => $request->name,
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

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.show')) {
            return back();
        }

        $availableUsers = User::whereHas('businesses', fn($q) => 
                $q->where('businesses.id', $group->business_id)
            )
            ->whereNotIn('id', $group->users->pluck('id'))
            ->get();

        $availableMaps = Map::where('business_id', $group->business_id)->get();

        return Inertia::render('job-groups/show', [
            'group' => $group,
            'users' => $availableUsers,
            'availableMaps' => $availableMaps,
        ]);
    }

    public function edit(Request $request, string $id)
    {
        $user = $request->user();
        $group = JobGroup::findOrFail($id);

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.update')) {
            return back();
        }

        return Inertia::render('job-groups/edit', ['group' => $group]);
    }

    public function update(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.update')) {
            return back();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('job-groups.index');
    }

    public function destroy(Request $request, string $id)
    {
        $group = JobGroup::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.delete')) {
            return back();
        }

        $group->delete();

        return redirect()->route('job-groups.index');
    }

    public function attachMap(Request $request, JobGroup $group)
    {
        $user = $request->user();
        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.attachMap')) {
            return back();
        }

        $data = $request->validate(['map_id' => 'required|exists:maps,id']);
        $map = Map::findOrFail($data['map_id']);

        if ($map->business_id !== $group->business_id) {
            return back();
        }

        if ($map->job_group_id !== $group->id) {
            Map::where('job_group_id', $group->id)->update(['job_group_id' => null]);
            $map->update(['job_group_id' => $group->id]);
        }

        return redirect()->route('job-groups.show', $group->id);
    }

    public function detachMap(Request $request, JobGroup $group)
    {
        $user = $request->user();
        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.detachMap')) {
            return back();
        }

        $data = $request->validate(['map_id' => 'required|exists:maps,id']);
        $map = Map::findOrFail($data['map_id']);

        if ($map->business_id !== $group->business_id || $map->job_group_id !== $group->id) {
            return back();
        }

        $map->update(['job_group_id' => null]);

        return redirect()->back();
    }

    public function updateUsers(Request $request, JobGroup $group)
    {
        $user = $request->user();
        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.addUsers')) {
            return back();
        }

        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $allowedUserIds = User::whereHas('businesses', fn($q) =>
                $q->where('businesses.id', $group->business_id)
            )
            ->whereIn('id', $validated['user_ids'])
            ->pluck('id')
            ->toArray();

        $group->users()->syncWithoutDetaching($allowedUserIds);

        return redirect()->route('job-groups.show', $group->id);
    }

    public function removeUser(Request $request, JobGroup $group, User $user)
    {
        $authUser = $request->user();
        if (! $this->ensureAuthorizedForGroup($authUser, $group, 'groups.removeUsers')) {
            return back();
        }

        if ($group->users()->where('users.id', $user->id)->exists()) {
            $group->users()->detach($user->id);
        }

        return redirect()->back();
    }

    private function resolveBusinessId($user, $inputId = null)
    {
        return match (true) {
            $user->hasRole('Owner') => $inputId,
            $user->hasRole('Business') && $user->ownedBusiness => $user->ownedBusiness->id,
            default => null,
        };
    }

    private function ensureAuthorizedForGroup($user, JobGroup $group, string $permission): bool
    {
        if ($user->hasRole('Owner')) return true;

        if (! $user->can($permission)) return false;

        $userBusinessId = $user->ownedBusiness?->id ?? $user->businesses()->value('businesses.id');
        return $userBusinessId === $group->business_id;
    }
}

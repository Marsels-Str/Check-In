<?php

namespace App\Http\Controllers\Groups;

use App\Models\Map;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $groups = match (true) {
            $user->hasRole('Owner') => Group::with('business')->get(),
            
            $user->can('groups.view') && $user->hasRole('Business') && $user->ownedBusiness =>
                Group::with('business')
                    ->where('business_id', $user->ownedBusiness->id)
                    ->get(),
            
            $user->can('groups.view') =>
                Group::whereHas('users',  fn($q) => $q->where('users.id', $user->id))
                    ->whereIn('business_id', $user->businesses()->pluck('businesses.id'))
                    ->with('business')
                    ->get(),
            
            default => collect(),
        };

        return Inertia::render('groups/index', compact('groups'));
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

        return Inertia::render('groups/create', [
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

        Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'business_id' => $businessId,
        ]);

        return redirect()->route('groups.index');
    }

    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $group = Group::with(['users', 'images:id,group_id,image_blob', 'map', 'business'])
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

        return Inertia::render('groups/show', [
            'group' => $group,
            'users' => $availableUsers,
            'availableMaps' => $availableMaps,
        ]);
    }

    public function edit(Request $request, string $id)
    {
        $user = $request->user();
        $group = Group::findOrFail($id);

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.update')) {
            return back();
        }

        return Inertia::render('groups/edit', ['group' => $group]);
    }

    public function update(Request $request, string $id)
    {
        $group = Group::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.update')) {
            return back();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return redirect()->route('groups.index');
    }

    public function destroy(Request $request, string $id)
    {
        $group = Group::findOrFail($id);
        $user = $request->user();

        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.delete')) {
            return back();
        }

        $group->delete();

        return redirect()->route('groups.index');
    }

    public function attachMap(Request $request, Group $group)
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

        if ($map->group_id !== $group->id) {
            Map::where('group_id', $group->id)->update(['group_id' => null]);
            $map->update(['group_id' => $group->id]);
        }

        return redirect()->route('groups.show', $group->id);
    }

    public function detachMap(Request $request, Group $group)
    {
        $user = $request->user();
        if (! $this->ensureAuthorizedForGroup($user, $group, 'groups.detachMap')) {
            return back();
        }

        $data = $request->validate(['map_id' => 'required|exists:maps,id']);
        $map = Map::findOrFail($data['map_id']);

        if ($map->business_id !== $group->business_id || $map->group_id !== $group->id) {
            return back();
        }

        $map->update(['group_id' => null]);

        return redirect()->back();
    }

    public function updateUsers(Request $request, Group $group)
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

        return redirect()->route('groups.show', $group->id);
    }

    public function removeUser(Request $request, Group $group, User $user)
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

    private function ensureAuthorizedForGroup($user, Group $group, string $permission): bool
    {
        if ($user->hasRole('Owner')) return true;

        if (! $user->can($permission)) return false;

        $userBusinessId = $user->ownedBusiness?->id ?? $user->businesses()->value('businesses.id');
        return $userBusinessId === $group->business_id;
    }
}

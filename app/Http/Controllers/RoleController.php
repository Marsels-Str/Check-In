<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $excludeForBusiness = ['Owner', 'Business', 'Unemployed'];

        if ($user->hasRole('Owner')) {
            $roles = Role::all();
        } else {
            $businessId = $user->ownedBusiness?->id;

            $roles = $businessId
                ? Role::where(function($q) use ($businessId) {
                        $q->whereNull('business_id')
                          ->orWhere('business_id', $businessId);
                  })
                  ->whereNotIn('name', ['Owner', 'Business', 'Unemployed'])
                  ->get()
                : collect();
        }

        return Inertia::render('roles/index', compact('roles'));
    }

    public function create(Request $request)
    {
        $user = $request->user();

        $businesses = match (true) {
            $user->hasRole('Owner') => Business::select('id', 'name')->orderBy('name')->get(),
            $user->hasRole('Business') && $user->ownedBusiness => collect([$user->ownedBusiness]),
            default => collect(),
        };

        $excludedForBusiness = [
            'users.create',
            'users.update',
            'users.delete',
            'business.access',
            'business.create',
            'languages.access',
        ];

        $permissions = Permission::query()->when($user->hasRole('Business'), function ($q) use ($excludedForBusiness) {
                $q->whereNotIn('name', $excludedForBusiness);
            })->orderBy('name')->pluck('name');

        return Inertia::render('roles/create', [
            'permissions' => $permissions,
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
            'name' => ['required', 'string', 'max:255'],
            'permissions' => 'required|array',
            'business_id' => 'nullable|exists:businesses,id',
        ]);

        $businessId = $request->input('business_id');

        if ($user->hasRole('Owner')) {
            if ($businessId === $user->ownedBusiness?->id) {
                $businessId = null;
            }
        } elseif ($user->hasRole('Business')) {
            $businessId = $user->ownedBusiness?->id;
        } else {
            return back();
        }

        $existsQuery = Role::where('name', $request->name)
            ->where('guard_name', 'web')
            ->where(function($q) use ($businessId) {
                $q->whereNull('business_id')
                  ->when($businessId, fn($q) => $q->orWhere('business_id', $businessId));
            });

        if ($existsQuery->exists()) {
            return back()->withErrors(['name' => 'Role name already exists!'])->withInput();
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
            'business_id' => $businessId,
        ]);

        $role->syncPermissions($request->permissions);

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $user = auth()->user();

        return Inertia::render('roles/show', [
            'role' => $role,
            'permissions' => $role->permissions()->pluck('name')
        ]);
    }

    public function edit(Role $role)
    {
        $user = auth()->user();

        if (!$user->hasRole('Owner')) {
            $authBusinessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id ?? null;

            if ($role->business_id && $role->business_id !== $authBusinessId) {
                return back();
            }

            if (is_null($role->business_id) && in_array($role->name, ['Owner', 'Business'])) {
                return back();
            }
        }

        return Inertia::render('roles/edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions()->pluck('name'),
            'permissions' => Permission::pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $user = auth()->user();

        if (!$user->hasRole('Owner')) {
            $authBusinessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id ?? null;

            if ($role->business_id && $role->business_id !== $authBusinessId) {
                return back();
            }

            if (is_null($role->business_id) && in_array($role->name, ['Owner', 'Business'])) {
                return back();
            }
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $user = auth()->user();

        if (!$user->hasRole('Owner')) {
            $authBusinessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id ?? null;

            if ($role->business_id && $role->business_id !== $authBusinessId) {
                return back();
            }

            if (is_null($role->business_id) && in_array($role->name, ['Owner', 'Business'])) {
                return back();
            }
        }

        $role->delete();

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}

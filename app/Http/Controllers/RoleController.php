<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\Business;

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

        return Inertia::render('roles/create', [
            'permissions' => Permission::pluck('name'),
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
            return back()->withErrors(['name' => 'Role name already exists in this scope.'])->withInput();
        }

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
            'business_id' => $businessId,
        ]);

        $role->syncPermissions($request->permissions);

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index');
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

        return redirect()->route('roles.index');
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

        return redirect()->route('roles.index');
    }
}

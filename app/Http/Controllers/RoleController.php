<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Exceptions\HttpResponseException;

class RoleController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $excludeForBusiness = ['Owner', 'Business', 'Unemployed'];

        if ($user->hasRole('Owner')) {
            $roles = Role::all();
        } else {
            $businessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id;

            if ($businessId) {
                $roles = Role::where('business_id', $businessId)
                    ->whereNotIn('name', ['Owner', 'Business', 'Unemployed'])
                    ->get();
            } else {
                $roles = collect();
            }
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
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'permissions' => 'required|array',
            'business_id' => 'nullable|exists:businesses,id',
        ]);

        $businessId = $data['business_id'] ?? null;
        $guardName = $businessId ? 'business' : 'web';

        $exists = Role::where('name', $data['name'])
            ->where('guard_name', $guardName)
            ->exists();

        if ($exists) {
            return redirect()->route('roles.create')->with('error', t('roles.error.exists'));
        }

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => $guardName,
            'business_id' => $businessId,
        ]);

        $permissions = Permission::whereIn('name', $data['permissions'])
            ->where('guard_name', $guardName)
            ->get();

        $role->syncPermissions($permissions);

        return redirect()->route('roles.index')->with('success', t('roles.success.create'));
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
        $this->authorizeRoleAccess($role, 'roles.update');

        return Inertia::render('roles/edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions()->pluck('name'),
            'permissions' => Permission::pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorizeRoleAccess($role, 'roles.update');

        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index')->with('success', t('roles.success.update'));
    }

    public function destroy(Role $role)
    {
        $this->authorizeRoleAccess($role, 'roles.delete');

        $role->delete();

        \Artisan::call('permission:cache-reset');

        return redirect()->route('roles.index')->with('success', t('roles.success.delete'));
    }

    private function authorizeRoleAccess(Role $role, string $permission = null)
    {
        $user = auth()->user();

        if ($user->hasRole('Owner')) {
            return;
        }

        $authBusinessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id ?? null;

        if (($permission && !$user->can($permission)) ||
            (is_null($role->business_id)) ||
            ($role->business_id && $role->business_id !== $authBusinessId)
        ) {
            throw new HttpResponseException(
                redirect()->route('roles.index')->with('error', t('roles.error.auth'))
            );
        }
    }
}

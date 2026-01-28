<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $auth = auth()->user();

        if ($auth->hasRole('Owner')) {
            $users = User::with([
                'roles',
                'profile:user_id,portrait',
                'businesses:id,name',
                'ownedBusiness:id,name,user_id'
            ])
            ->withExists(['timeLogs as is_clocked_in' => fn($q) => $q->whereNull('clock_out')])
            ->get();
        }
        else {
            $businessId = $auth->ownedBusiness->id
                ?? $auth->businesses->first()?->id
                ?? null;

            $users = User::with([
                'roles',
                'profile:user_id,portrait',
                'businesses:id,name',
                'ownedBusiness:id,name,user_id'
            ])
            ->where(function ($q) use ($businessId) {
                $q->whereHas('businesses', fn($q) => $q->where('business_id', $businessId))
                  ->orWhereHas('ownedBusiness', fn($q) => $q->where('id', $businessId));
            })
            ->withExists(['timeLogs as is_clocked_in' => fn($q) => $q->whereNull('clock_out')])
            ->get();
        }

        $users = $users->map(function ($user) {
            $allBusinesses = $user->businesses->pluck('name')->toArray();

            if ($user->ownedBusiness) {
                $allBusinesses[] = $user->ownedBusiness->name;
            }

            $user->all_businesses = $allBusinesses;
            return $user;
        });

        return Inertia::render('users/index', [
            'users' => $users,
            'currentUser' => $auth,
        ]);
    }

    public function assignForm(Request $request, User $user)
    {
        $auth = $request->user();

        $userBusiness = $user->ownedBusiness ?? $user->businesses->first();
        $userBusinessId = $userBusiness?->id;

        if ($auth->hasRole('Owner')) {
            return Inertia::render('users/assign', [
                'user' => $user,
                'current_business_id' => $userBusinessId,
                'globalRoles' => Role::whereNull('business_id')->orderBy('name')->get(),
                'businessRoles' => $userBusinessId
                    ? Role::where('business_id', $userBusinessId)->orderBy('name')->get()
                    : collect(),
                'userRole' => $user->roles->pluck('id')->toArray(),
            ]);
        }

        $authBusinessId = $auth->ownedBusiness->id
            ?? $auth->businesses->first()?->id
            ?? null;

        if ($authBusinessId && $userBusinessId !== $authBusinessId) {
            return back();
        }

        return Inertia::render('users/assign', [
            'user' => $user,
            'current_business_id' => $userBusinessId,

            'globalRoles' => Role::whereNull('business_id')
                ->whereNotIn('name', ['Owner', 'Business'])
                ->orderBy('name')
                ->get(),

            'businessRoles' => Role::where('business_id', $authBusinessId)
                ->whereNotIn('name', ['Owner', 'Business'])
                ->orderBy('name')
                ->get(),

            'userRole' => $user->roles->pluck('id')->toArray(),
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $auth = $request->user();

        $request->validate([
            'role_ids' => 'required|array',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $roles = Role::whereIn('id', $request->role_ids)->get();

        if (!$auth->hasRole('Owner')) {

            $authBusinessId = $auth->ownedBusiness->id
                ?? $auth->businesses->first()?->id
                ?? null;

            foreach ($roles as $role) {

                if ($role->business_id && $role->business_id !== $authBusinessId) {
                    return back();
                }

                if (is_null($role->business_id) && in_array($role->name, ['Owner', 'Business'])) {
                    return back();
                }
            }
        }

        $user->syncRoles($roles);

        \Artisan::call('permission:cache-reset');

        return redirect()->route('users.index')->with('success', t('users.success.assign'));
    }

    public function create()
    {
        return Inertia::render('users/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:1|max:50',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:8|max:15',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', t('users.success.store'));
    }

    public function show(string $id)
    {
        $user = User::with(['profile', 'roles', 'businesses', 'ownedBusiness'])->findOrFail($id);

        return Inertia::render('users/show', [
            'user' => $user
        ]);
    }

    public function edit(string $id)
    {
        $user = User::with('profile')->findOrFail($id);

        return Inertia::render('users/edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|min:1|max:50',
            'email' => 'required|email|max:100|unique:users,email,'.$id,
            'password' => 'nullable|string|min:8|max:15',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('users.edit', $user->id)->with('success', t('users.success.update'));
    }

    public function destroy(string $id)
    {
        if (!auth()->user()->hasRole('Owner')) {
            return back();
        }

        User::destroy($id);
        return redirect()->route('users.index')->with('success', t('users.success.delete'));
    }
}

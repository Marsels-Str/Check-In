<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles', 'profile:user_id,portrait', 'businesses:id,name')
        ->withExists(['timeLogs as is_clocked_in' => function ($query) {
            $query->whereNull('clock_out');
        }])->get();
        $currentUser = auth()->user();

        return Inertia::render('users/index', [
            'users' => $users,
            'currentUser' => $currentUser
        ]);
    }

    public function assignForm(User $user)
    {
        $roles = Role::all();
        $userRoles = $user->roles()->pluck('id')->toArray();
        
        return inertia('users/assign',[
        'user' => $user,
        'roles' => $roles,
        'userRoles' => $userRoles,
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([ 
        'role_ids' => 'required|array',
        'role_ids.*' => 'exists:roles,id',
        ]);

        $user->syncRoles($request->role_ids);

        return redirect()->route('users.index');
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'roles' => Role::pluck('name')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:1|max:50',
            'email' => 'required|email|max:100|unique:users',
            'password' => 'required|string|min:8|max:15',
        ],[
            'name.required' => 'OK Mr.nobody, enter name.',
            'name.max' => 'There is no way youre name is that long!',
            'email.required' => 'You must have an email, right?',
            'email.unique' => 'Nice try, but not today.',
            'password.required' => 'You want to be safe or not?',
            'password.min' => 'You can do better than that.',
            'password.max' => 'Thats enough genius!'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->profile()->create([
            'age' => null,
            'height' => null,
            'weight' => null,
            'phone' => null,
            'personal_code' => null,
            'country' => null,
            'city' => null,
            'portrait' => null,
        ]);

        return redirect()->route('users.index');
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
        $request->validate([
            'name' => 'required|string|min:1|max:50',
            'email' => 'required|email|max:100|unique:users,email,'.$id,
            'password' => 'nullable|string|min:8|max:15',
        ], [
            'name.required' => 'OK Mr.nobody, enter name.',
            'name.max' => 'There is no way youre name is that long!',
            'email.required' => 'You must have an email, right?',
            'email.unique' => 'Nice try, but not today.',
            'password.required' => 'You want to be safe or not?',
            'password.min' => 'You can do better than that.',
            'password.max' => 'Thats enough genius!'
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return back();
    }

    public function destroy(string $id)
    {
        User::destroy($id);

        return redirect()->route('users.index');
    }
}

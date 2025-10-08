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
        $users = User::with('roles')->get();
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
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index');
    }

    public function show(string $id)
    {
        return Inertia::render('users/show', [

        'user' => User::findOrFail($id)
        ]);
    }

    public function edit(string $id)
    {
        $user = User::FindOrFail($id);

        return Inertia::render('users/edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|string|email|max:100|unique:users,email,'.$id,
            'password' => 'nullable|string|min:8',
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('users.index');
    }

    public function destroy(string $id)
    {
        User::destroy($id);

        return redirect()->route('users.index');
    }
}

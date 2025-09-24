<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\JobGroup;
use Illuminate\Http\Request;

class JobGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Tiek renderētas visas darba grupas
        return Inertia::render('job-groups/index', [
            'jobGroups' => JobGroup::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('job-groups/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        JobGroup::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('job-groups.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $group = JobGroup::with([
            'users',
            'images:id,job_group_id,image_blob'
        ])->findOrFail($id);

        $availableUsers = User::whereNotIn('id', $group->users->pluck('id'))->get();

        return Inertia::render('job-groups/show', [

        'group' => $group,
        'users' => $availableUsers,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $group = JobGroup::FindOrFail($id);

        return Inertia::render('job-groups/edit', [
            'group' => $group
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $group = JobGroup::findOrFail($id);

        $group->name = $request->name;
        $group->description = $request->description;

        $group->save();

        return redirect()->route('job-groups.index');
    }

    public function updateUsers(Request $request, string $id)
    {
        $request->validate([
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
        ]);

        $group = JobGroup::findOrFail($id);

        // Sync users with the group
        $group->users()->syncWithoutDetaching($request->users ?? []);

        return redirect()->route('job-groups.show', $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        JobGroup::destroy($id);

        return redirect()->route('job-groups.index');
    }
}

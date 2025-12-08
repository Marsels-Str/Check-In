<?php

namespace App\Http\Controllers;

use App\Models\JobGroup;
use App\Models\GroupImage;
use Illuminate\Http\Request;

class GroupImageController extends Controller
{
    public function store(Request $request, JobGroup $group)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ], [
            'image.required' => 'An image is required.',
            'image.mimes' => 'The image must be a file of type: jpg, jpeg, png.',
            'image.max' => 'The image may not be greater than 5MB.',
        ]);

        $path = $request->file('image')->getRealPath();
        $data = base64_encode(file_get_contents($path));

        $group->images()->create([
            'image_blob' => $data,
        ]);

        return redirect()->route('job-groups.show', $group);
    }

    public function destroy(string $id)
    {
        $image = GroupImage::findOrFail($id);
        $groupId = $image->job_group_id;
        $image->delete();

        return redirect()->route('job-groups.show', $groupId);
    }
}

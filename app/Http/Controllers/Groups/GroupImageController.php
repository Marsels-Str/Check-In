<?php

namespace App\Http\Controllers\Groups;

use App\Models\Group;
use App\Models\GroupImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GroupImageController extends Controller
{
    public function store(Request $request, Group $group)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $path = $request->file('image')->getRealPath();
        $data = base64_encode(file_get_contents($path));

        $group->images()->create([
            'image_blob' => $data,
        ]);

        return redirect()->route('groups.show', $group);
    }

    public function destroy(string $id)
    {
        $image = GroupImage::findOrFail($id);
        $groupId = $image->group_id;
        $image->delete();

        return redirect()->route('groups.show', $groupId);
    }
}

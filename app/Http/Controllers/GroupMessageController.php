<?php

namespace App\Http\Controllers;

use App\Models\JobGroup;
use Illuminate\Http\Request;
use App\Events\GroupMessageSent;

class GroupMessageController extends Controller
{
    public function store(Request $request, JobGroup $group)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = auth()->user();

        $isGroupMember = $group->users()
            ->where('users.id', $user->id)
            ->exists();

        $isBusinessOwner = $group->business
            && $group->business->user_id === $user->id;

        $isAdmin = $user->hasRole('Owner');

        abort_unless(
            $isGroupMember || $isBusinessOwner || $isAdmin,
            403
        );

        $message = $group->messages()->create([
            'user_id' => $user->id,
            'message' => $request->message,
        ]);

        $message->load('user');

        broadcast(new GroupMessageSent($message))->toOthers();

        return response()->json($message);
    }
}

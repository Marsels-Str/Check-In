<?php

use App\Models\JobGroup;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    $group = JobGroup::with('business')->find($groupId);

    if (! $group) return false;

    $isGroupMember = $group->users()
        ->where('users.id', $user->id)
        ->exists();

    $isBusinessOwner = $group->business
        && $group->business->user_id === $user->id;

    $isAdmin = $user->hasRole('Owner');

    return $isGroupMember || $isBusinessOwner || $isAdmin;
});

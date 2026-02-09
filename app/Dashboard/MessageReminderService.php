<?php

namespace App\Dashboard;

use App\Models\Group;
use App\Models\GroupMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageReminderService
{
    public static function make(Request $request): array
    {
        $user = $request->user();

        $belongsToBusiness =
            $user->ownedBusiness()->exists() || $user->businesses()->exists();

        if (! $belongsToBusiness) {
            return [
                'data' => [],
                'empty' => 'no-business',
            ];
        }

        $businessId = self::resolveBusinessId($request, $user);

        if (! $businessId) {
            return [
                'data' => [],
                'empty' => 'no-business',
            ];
        }

        $groups = self::resolveVisibleGroups($request, $user, $businessId);

        if ($groups->isEmpty()) {
            return [
                'data' => [],
                'empty' => 'nothing-to-show',
            ];
        }

        $data = $groups->map(function ($group) use ($user) {
            $lastReadAt = DB::table('group_user_reads')
                ->where('group_id', $group->id)
                ->where('user_id', $user->id)
                ->value('last_read_at');

            $unread = GroupMessage::where('group_id', $group->id)
                ->where('user_id', '!=', $user->id)
                ->when($lastReadAt, fn ($q) => $q->where('created_at', '>', $lastReadAt))
                ->count();

            return [
                'group_id' => $group->id,
                'group_name' => $group->name,
                'unread_count' => $unread,
                'has_unread' => $unread > 0,
            ];
        })->values()->all();

        usort($data, fn ($a, $b) => $b['unread_count'] <=> $a['unread_count']);

        return [
            'data' => $data,
        ];
    }

    private static function resolveBusinessId(Request $request, $user): ?int
    {
        if ($user->hasRole('Owner')) {
            return $request->input('business_id');
        }

        if ($user->hasRole('Business')) {
            return $user->ownedBusiness?->id;
        }

        return $user->businesses()->value('business_id');
    }

    private static function resolveVisibleGroups(Request $request, $user, int $businessId)
    {
        if ($user->hasRole('Owner') || $user->hasRole('Business')) {
            return Group::where('business_id', $businessId)->get();
        }

        return Group::where('business_id', $businessId)
            ->whereHas('users', fn ($q) => $q->where('users.id', $user->id))
            ->get();
    }
}

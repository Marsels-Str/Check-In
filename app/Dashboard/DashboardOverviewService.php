<?php

namespace App\Dashboard;

use Carbon\Carbon;
use App\Models\User;
use App\Models\TimeLog;
use App\Models\Business;
use Illuminate\Http\Request;

class DashboardOverviewService
{
    public static function make(Request $request): array
    {
        $user = $request->user();
        $belongsToBusiness = $user->ownedBusiness()->exists() || $user->businesses()->exists();

        if (! $belongsToBusiness) {
            return ['empty' => 'nothing-to-show'];
        }
        if ($user->hasRole('Business')) {
            $businessId = Business::where('user_id', $user->id)->value('id');

            return $businessId
                ? self::business($businessId)
                : ['empty' => 'nothing-to-show'];
        }
        if ($user->hasRole('Owner')) {
            $businessId = $request->input('business_id');

            return $businessId
                ? self::business($businessId)
                : ['empty' => 'nothing-to-show'];
        }
        return self::personal($user);
    }

    private static function personal(User $user): array
    {
        $activeLog = TimeLog::where('user_id', $user->id)
            ->whereNull('clock_out')
            ->latest('clock_in')
            ->first();

        return [
            'self' => [
                'id'            => $user->id,
                'name'          => $user->name,
                'profile'       => [
                    'portrait' => $user->profile?->portrait,
                ],
                'is_clocked_in' => (bool) $activeLog,
                'time_logs'     => $activeLog
                    ? [[
                        'clock_in'  => $activeLog->clock_in->toIso8601String(),
                        'clock_out' => null,
                    ]]
                    : [],
            ],
        ];
    }

    private static function business(int $businessId): array
    {
        $employees = User::whereHas('businesses', fn ($q) =>
                $q->where('businesses.id', $businessId)
            )
            ->with([
                'profile:user_id,portrait',
                'businesses' => fn ($q) =>
                    $q->where('businesses.id', $businessId),
            ])
            ->get();

        $logsByUser = TimeLog::where('business_id', $businessId)
            ->orderByDesc('clock_in')
            ->get()
            ->groupBy('user_id');

        $users = [];

        foreach ($employees as $user) {
            $pivot    = $user->businesses->first()?->pivot;
            $joinedAt = $pivot?->created_at;

            $validLog = $logsByUser[$user->id] ?? collect();

            $validLog = $validLog->first(function ($log) use ($joinedAt) {
                if (! $log->clock_in) {
                    return false;
                }
                return ! $joinedAt || $log->clock_in->greaterThanOrEqualTo($joinedAt);
            });

            $isClockedIn = $validLog && is_null($validLog->clock_out);

            $users[] = [
                'id'            => $user->id,
                'name'          => $user->name,
                'profile'       => [
                    'portrait' => $user->profile?->portrait,
                ],
                'is_clocked_in' => $isClockedIn,
                'time_logs' => $isClockedIn
                    ? [[
                        'clock_in'  => $validLog->clock_in->toIso8601String(),
                        'clock_out' => null,
                    ]]
                    : [],
                'offline_for' => (! $isClockedIn && $validLog?->clock_out)
                    ? $validLog->clock_out->diffForHumans()
                    : null,
            ];
        }
        return ['users' => $users];
    }
}

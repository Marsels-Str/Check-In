<?php

namespace App\Dashboard;

use Carbon\Carbon;
use App\Models\TimeLog;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;

class WorkedHoursService
{
    public static function make(Request $request): array
    {
        $user = $request->user();
        $isOwner = $user->hasRole('Owner');
        $businessId = $request->input('business_id');
        $range = $request->input('range_hours', 'week');
        $isBusinessOwner = $user->ownedBusiness()->exists();
        $belongsToBusiness = $user->ownedBusiness()->exists() || $user->businesses()->exists();

        if (! $belongsToBusiness) {
            return [
                'data' => [],
                'range' => $request->input('range_hours', 'week'),
                'empty' => 'nothing-to-show',
            ];
        }

        [$from, $to] = match ($range) {
            'month' => [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ],
            default => [
                now()->startOfWeek(Carbon::MONDAY),
                now()->endOfWeek(Carbon::SUNDAY),
            ],
        };

        $logsQuery = TimeLog::whereNotNull('clock_out');

        if ($isOwner) {
            if ($businessId) {
                $logsQuery->where('business_id', $businessId);
            }
        } elseif ($isBusinessOwner) {
            $logsQuery->where('business_id', $user->ownedBusiness->id);
        } else {
            $logsQuery->where('user_id', $user->id);
        }

        $logsQuery->where(function ($q) use ($from, $to) {
            $q->where('clock_in', '<', $to)
            ->where('clock_out', '>', $from);
        });

        $logs = $logsQuery->get();

        $data = collect(CarbonPeriod::create($from, $to))->map(function (Carbon $day) use ($logs, $range) {

                $dayStart = $day->copy()->startOfDay()->getTimestamp();
                $dayEnd   = $day->copy()->endOfDay()->getTimestamp();

                $seconds = $logs->sum(function ($log) use ($dayStart, $dayEnd) {

                    $start = max($log->clock_in->getTimestamp(), $dayStart);
                    $end   = min($log->clock_out->getTimestamp(), $dayEnd);

                    return max(0, $end - $start);
                });

                return [
                    'label' => $range === 'month'
                        ? $day->format('j')
                        : $day->format('D'),
                    'hours' => round($seconds / 3600),
                ];
            })
            ->values();

        return [
            'data'  => $data,
            'range' => $range,
        ];
    }
}

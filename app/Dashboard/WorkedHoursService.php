<?php

namespace App\Dashboard;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\TimeLog;
use Illuminate\Http\Request;

class WorkedHoursService
{
    public static function make(Request $request): array
    {
        $user = $request->user();

        $businessId = match (true) {
            $user->hasRole('Owner') =>
                $request->input('business_id'),

            $user->ownedBusiness =>
                $user->ownedBusiness->id,

            default =>
                $user->businesses()->value('businesses.id'),
        };

        if (! $businessId) {
            return ['data' => []];
        }

        $range = $request->input('range', 'week');

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

        $logs = TimeLog::where('business_id', $businessId)
            ->whereNotNull('clock_out')
            ->where(function ($q) use ($from, $to) {
                $q->where('clock_in', '<', $to)
                  ->where('clock_out', '>', $from);
            })
            ->get();

        $data = collect(CarbonPeriod::create($from, $to))->map(function (Carbon $day) use ($logs) {

                $dayStart = $day->copy()->startOfDay()->getTimestamp();
                $dayEnd   = $day->copy()->endOfDay()->getTimestamp();

                $seconds = $logs->sum(function ($log) use ($dayStart, $dayEnd) {

                    $start = max($log->clock_in->getTimestamp(), $dayStart);
                    $end   = min($log->clock_out->getTimestamp(), $dayEnd);

                    return max(0, $end - $start);
                });

                return [
                    'label' => $day->format('D'),
                    'hours' => round($seconds / 3600, 2),
                ];
            })
            ->values();

        return [
            'data'  => $data,
            'range' => $range,
        ];
    }
}

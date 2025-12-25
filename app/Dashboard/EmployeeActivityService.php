<?php

namespace App\Dashboard;

use Carbon\Carbon;
use App\Models\TimeLog;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;

class EmployeeActivityService
{
    public static function make(Request $request): array
    {
        $user = $request->user();
        $isOwner = $user->hasRole('Owner');

        $businessId = $request->input('business_id');
        $range = $request->input('range_activity', 'week');

        if (! $businessId && ! $isOwner) {
            return [
                'data'  => self::emptySeries($range),
                'range' => $range,
            ];
        }

        [$from, $to] = match ($range) {
            'month' => [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ],
            default => [
                now()->startOfWeek(CarbonInterface::MONDAY),
                now()->endOfWeek(CarbonInterface::SUNDAY),
            ],
        };

        $logsQuery = TimeLog::query()
            ->select(['user_id', 'clock_in', 'clock_out'])
            ->where('clock_in', '<', $to)
            ->where(function ($q) use ($from) {
                $q->where('clock_out', '>', $from)
                ->orWhereNull('clock_out');
            });

        if ($businessId) {
            $logsQuery->where('business_id', $businessId);
        }

        if (! $isOwner) {
            $logsQuery->where('user_id', $user->id);
        }

        $logs = $logsQuery->get();

        $pairs = collect();

        foreach ($logs as $log) {
            $start = $log->clock_in;
            $end = $log->clock_out ?? now();

            if ($start < $from) $start = $from;
            if ($end > $to) $end = $to;

            if ($end <= $start) {
                continue;
            }

            $dayCursor = $start->copy()->startOfDay();
            $lastDay   = $end->copy()->startOfDay();

            while ($dayCursor <= $lastDay) {
                $dayStart = $dayCursor->copy();
                $dayEnd   = $dayCursor->copy()->addDay();

                if ($start < $dayEnd && $end > $dayStart) {
                    $pairs->push($dayStart->format('Y-m-d') . '|' . $log->user_id);
                }

                $dayCursor->addDay();
            }
        }

        $countsByDay = $pairs
            ->unique()
            ->map(fn ($key) => explode('|', $key)[0])
            ->countBy();

        $data = [];
        $cursor = $from->copy()->startOfDay();

        while ($cursor <= $to) {
            $key = $cursor->format('Y-m-d');

            $data[] = [
                'label' => $range === 'month'
                    ? $cursor->format('j')
                    : $cursor->format('D'),
                'count' => (int) ($countsByDay[$key] ?? 0),
            ];

            $cursor->addDay();
        }

        return [
            'data'  => $data,
            'range' => $range,
        ];
    }

    private static function emptySeries(string $range): array
    {
        [$from, $to] = match ($range) {
            'month' => [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ],
            default => [
                now()->startOfWeek(CarbonInterface::MONDAY),
                now()->endOfWeek(CarbonInterface::SUNDAY),
            ],
        };

        $data = [];
        $cursor = $from->copy()->startOfDay();

        while ($cursor <= $to) {
            $data[] = [
                'label' => $range === 'month'
                    ? $cursor->format('j')
                    : $cursor->format('D'),
                'count' => 0,
            ];

            $cursor->addDay();
        }

        return $data;
    }
}

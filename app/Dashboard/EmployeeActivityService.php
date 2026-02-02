<?php

namespace App\Dashboard;

use App\Models\TimeLog;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;

class EmployeeActivityService
{
    public static function make(Request $request): array
    {
        $user = $request->user();
        $range = $request->input('range_activity', 'week');
        $businessId = self::resolveBusinessId($request, $user);
        $belongsToBusiness = $user->ownedBusiness()->exists() || $user->businesses()->exists();

        if (! $belongsToBusiness) {
            return [
                'data' => [],
                'range' => $request->input('range_hours', 'week'),
                'empty' => 'nothing-to-show',
            ];
        }

        if (! $businessId && ! $user->hasRole('Owner')) {
            return [
                'data' => self::empty($range),
                'range' => $range,
            ];
        }

        [$from, $to] = self::resolveRange($range);

        $query = self::baseOverlapQuery($from, $to);
        $query = self::applyVisibility($query, $user, $businessId);

        $logs   = $query->get();
        $pairs  = self::explodeLogsByDay($logs, $from, $to);
        $counts = self::countByDay($pairs);

        return [
            'data' => self::buildChartData($from, $to, $counts, $range),
            'range' => $range,
        ];
    }

    // If there is nothing to show, what should the chart look like?
    private static function empty(string $range): array
    {
        [$from, $to] = self::resolveRange($range);

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

    // Which business does this request apply to?
    private static function resolveBusinessId(Request $request, $user): ?int
    {
        if ($request->filled('business_id')) {
            return (int) $request->input('business_id');
        }

        if ($user->hasRole('Owner')) {
            return null;
        }

        return $user->ownedBusiness?->id
            ?? $user->businesses()->value('businesses.id');
    }

    // What exact dates does ‘week’ or ‘month’ mean?
    private static function resolveRange(string $range): array
    {
        return match ($range) {
            'month' => [
                now()->startOfMonth(),
                now()->endOfMonth(),
            ],
            default => [
                now()->startOfWeek(CarbonInterface::MONDAY),
                now()->endOfWeek(CarbonInterface::SUNDAY),
            ],
        };
    }

    // Which timelogs touch this date range at all?
    private static function baseOverlapQuery($from, $to)
    {
        return TimeLog::query()
            ->select(['user_id', 'clock_in', 'clock_out'])
            ->where('clock_in', '<', $to)
            ->where(function ($q) use ($from) {
                $q->where('clock_out', '>', $from)
                ->orWhereNull('clock_out');
            });
    }

    // Which logs is this user allowed to see?
    private static function applyVisibility($query, $user, ?int $businessId)
    {
        if ($businessId) {
            $query->where('business_id', $businessId);
        }

        if (! $user->hasRole('Owner') && ! $user->hasRole('Business')) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    //  On which days was each user active?
    private static function explodeLogsByDay($logs, $from, $to): array
    {
        $pairs = [];

        foreach ($logs as $log) {
            $start = max($log->clock_in, $from);
            $end = min($log->clock_out ?? now(), $to);

            if ($end <= $start) continue;

            for (
                $day = $start->copy()->startOfDay();
                $day <= $end;
                $day->addDay()
            ) {
                $pairs[] = $day->format('Y-m-d') . '|' . $log->user_id;
            }
        }

        return $pairs;
    }

    // How many unique users were active per day?
    private static function countByDay(array $pairs): array
    {
        return collect($pairs)
            ->unique()
            ->map(fn ($key) => explode('|', $key)[0])
            ->countBy()
            ->toArray();
    }

    // What exact data structure does the chart need?
    private static function buildChartData($from, $to, array $counts, string $range): array
    {
        $data = [];

        for (
            $day = $from->copy()->startOfDay();
            $day <= $to;
            $day->addDay()
        ) {
            $key = $day->format('Y-m-d');

            $data[] = [
                'label' => $range === 'month' ? $day->format('j') : 'dashboard.diagrams.weekday.' . $day->format('N'),
                'count' => (int) ($counts[$key] ?? 0),
            ];
        }

        return $data;
    }
}

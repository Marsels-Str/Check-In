<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\AutoClockToken;
use Illuminate\Console\Command;
use App\Models\AutoClockSetting;
use App\Mail\ClockInReminderMail;
use App\Mail\ClockOutReminderMail;
use Illuminate\Support\Facades\Mail;

class AutoClockScheduler extends Command
{
    protected $signature = 'auto-clock:run';
    protected $description = 'Handles auto clock-in/out, lunch breaks, and reminder emails.';

    public function handle()
    {
        //Kad jāgriež pulkstenis stundu uz priekšu vai atpakaļ, tad izmantot šo ->subHour() vai ->addHour()
        $now = Carbon::now();
        AutoClockToken::where('expires_at', '<=', now())->delete();
        $settings = AutoClockSetting::with('user')->get();

        foreach ($settings as $setting) {
            if (!$setting->user || !$setting->work_start || !$setting->work_end) continue;

            $workStart = Carbon::createFromTimeString($setting->work_start);
            $workEnd = Carbon::createFromTimeString($setting->work_end);

            if ($now->between($workStart->copy()->subMinutes(5), $workStart)) {
                $this->sendEmail($setting->user, 'clockin');
            }

            if ($now->between($workEnd->copy()->subMinutes(5), $workEnd) && $this->isUserClockedIn($setting->user)) {
                $this->sendEmail($setting->user, 'clockout');
            }

            if ($setting->lunch_start && $setting->lunch_end) {
                $lunchStart = Carbon::createFromTimeString($setting->lunch_start);
                $lunchEnd = Carbon::createFromTimeString($setting->lunch_end);

                if ($now->isSameMinute($lunchStart) && $this->isUserClockedIn($setting->user)) {
                    $this->info("→ Lunch started");
                    $setting->user->pauseForLunch();
                }

                if ($now->isSameMinute($lunchEnd) && ! $this->isUserClockedIn($setting->user)) {
                    $this->info("→ Lunch ended");
                    $setting->user->resumeAfterLunch();
                }
            }

            if (!empty($setting->extended_minutes)) {
                $extendedEnd = $workEnd->copy()->addMinutes($setting->extended_minutes);
                if ($now->lessThan($extendedEnd)) continue;

                $setting->user->clockOutAutomatically();
                $setting->update(['extended_minutes' => null]);
                continue;
            }

            if ($now->greaterThanOrEqualTo($workEnd) && $this->isUserClockedIn($setting->user)) {
                $this->info("→ Auto clock-out at end of day");
                $setting->user->clockOutAutomatically();
            }
        }

        $this->info('Auto clock executed at ' . now());
    }

    private function sendEmail($user, $type)
    {
        $exists = AutoClockToken::where('user_id', $user->id)
            ->where('action_type', $type)
            ->where('expires_at', '>', now())
            ->exists();

        if ($exists) return;

        $token = Str::random(32);
        AutoClockToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'action_type' => $type,
            'expires_at' => now()->addMinutes(5),
        ]);

        $type === 'clockin'
            ? Mail::to($user->email)->send(new ClockInReminderMail($user, $token))
            : Mail::to($user->email)->send(new ClockOutReminderMail($user, $token));

        $this->info("→ {$type} email sent to {$user->email}");
    }

    private function isUserClockedIn($user)
    {
        return $user->timeLogs()->whereNull('clock_out')->exists();
    }
}

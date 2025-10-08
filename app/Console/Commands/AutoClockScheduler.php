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
    protected $description = 'Handles automatic clock-in/out, lunch breaks, and reminders for users.';

    public function handle()
    {
        $now = Carbon::now();

        AutoClockToken::where('expires_at', '<=', now())->delete();

        $settings = AutoClockSetting::with('user')->get();

        foreach ($settings as $setting) {
            if (!$setting->user || !$setting->work_start || !$setting->work_end) {
                continue;
            }

            $userNow   = $now->copy()->setTimezone('Europe/Riga');
            $workStart = Carbon::createFromTimeString($setting->work_start, 'Europe/Riga');
            $workEnd   = Carbon::createFromTimeString($setting->work_end, 'Europe/Riga');

            $this->info("Checking {$setting->user->name} | Now: {$userNow->format('H:i')} | Start: {$workStart->format('H:i')} | End: {$workEnd->format('H:i')}");

            if ($userNow->between($workStart->copy()->subMinutes(5), $workStart)) {
                $this->sendEmail($setting->user, 'clockin');
            }

            if ($userNow->between($workEnd->copy()->subMinutes(5), $workEnd)) {
                $this->sendEmail($setting->user, 'clockout');
            }

            if ($setting->lunch_start && $setting->lunch_end) {
                $lunchStart = Carbon::createFromTimeString($setting->lunch_start, 'Europe/Riga');
                $lunchEnd   = Carbon::createFromTimeString($setting->lunch_end, 'Europe/Riga');

                if ($userNow->isSameMinute($lunchStart)) {
                    if ($this->isUserClockedIn($setting->user)) {
                        $this->info("→ Pausing work for lunch ({$lunchStart->format('H:i')})");
                        $setting->user->pauseForLunch();
                    }
                }

                if ($userNow->isSameMinute($lunchEnd)) {
                    if (! $this->isUserClockedIn($setting->user)) {
                        $this->info("→ Resuming work after lunch ({$lunchEnd->format('H:i')})");
                        $setting->user->resumeAfterLunch();
                    }
                }
            }

            if (!is_null($setting->extended_minutes) && $setting->extended_minutes > 0) {
                $extendedEnd = $workEnd->copy()->addMinutes($setting->extended_minutes);

                if ($userNow->lessThan($extendedEnd)) {
                    $this->info("→ Still within extended time (ends at {$extendedEnd->format('H:i')})");
                    continue;
                }

                $this->info("→ Auto clock-out (extension complete +{$setting->extended_minutes}m)");
                $setting->user->clockOutAutomatically();
                $setting->update(['extended_minutes' => null]);
                continue;
            }

            if ($userNow->greaterThanOrEqualTo($workEnd) && $this->isUserClockedIn($setting->user)) {
                $this->info('→ Auto clock-out (normal end reached)');
                $setting->user->clockOutAutomatically();
            }
        }

        $this->info('Auto clock job executed at ' . now());
    }

    private function sendEmail($user, $type)
    {
        $existingToken = AutoClockToken::where('user_id', $user->id)
            ->where('action_type', $type)
            ->where('expires_at', '>', now())
            ->exists();

        if ($existingToken) {
            $this->info("→ Skipping: {$type} email already active for {$user->name}");
            return;
        }

        $token = Str::random(32);

        AutoClockToken::create([
            'user_id'     => $user->id,
            'token'       => $token,
            'action_type' => $type,
            'expires_at'  => now()->addMinutes(5),
        ]);

        if ($type === 'clockin') {
            Mail::to($user->email)->send(new ClockInReminderMail($user, $token));
        } else {
            Mail::to($user->email)->send(new ClockOutReminderMail($user, $token));
        }

        $this->info("→ Sent {$type} email to {$user->email}");
    }

    private function isUserClockedIn($user)
    {
        return $user->timeLogs()->whereNull('clock_out')->exists();
    }
}

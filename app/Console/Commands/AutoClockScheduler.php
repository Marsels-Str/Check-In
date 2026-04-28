<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\AutoClockToken;
use Illuminate\Console\Command;
use App\Models\AutoClockSettings;
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
        $settings = AutoClockSettings::with('user')->get();

        // Iet cauri visiem iestatījumiem un pārbauda, vai ir jāveic kāda no darbībām
        foreach ($settings as $setting) {
            if (!$setting->user || !$setting->work_start || !$setting->work_end) continue;

            // Izveido sākuma un beigu darba laikus
            $workStart = Carbon::createFromTimeString($setting->work_start);
            $workEnd = Carbon::createFromTimeString($setting->work_end);

            // Ja no šī brīža līdz darba sākumam ir mazāk nekā 5 minūtes, nosūta e-pastu
            if ($now->between($workStart->copy()->subMinutes(5), $workStart)) {
                $this->sendEmail($setting->user, 'clockin');
            }

            // Ja no šī brīža līdz darba beigām ir mazāk nekā 5 minūtes, nosūta e-pastu, ja lietotājs ir iepriekš pieslēdzies
            if ($now->between($workEnd->copy()->subMinutes(5), $workEnd) && $this->isUserClockedIn($setting->user)) {
                $this->sendEmail($setting->user, 'clockout');
            }

            if ($setting->lunch_start && $setting->lunch_end) {
                // Izveido pusdienu pārtraukuma sākuma un beigu laikus
                $lunchStart = Carbon::createFromTimeString($setting->lunch_start);
                $lunchEnd = Carbon::createFromTimeString($setting->lunch_end);

                // Ja šis brīdis sakrīt pusdienu pārtraukuma sākumu un lietotājs ir pieslēdzies, tad pauzē darbu
                if ($now->isSameMinute($lunchStart) && $this->isUserClockedIn($setting->user)) {
                    $this->info("→ Lunch started");
                    $setting->user->pauseForLunch();
                }

                // Ja šis brīdis sakrīt pusdienu pārtraukuma beigām un lietotāja darbs ir pauzēts, tad atsāk darbu
                if ($now->isSameMinute($lunchEnd) && ! $this->isUserClockedIn($setting->user)) {
                    $this->info("→ Lunch ended");
                    $setting->user->resumeAfterLunch();
                }
            }

             // Ja darba laika pagarinājums nav iestatīts, tad izlaiž šo darbību
            if (!empty($setting->extended_minutes)) {
                $extendedEnd = $workEnd->copy()->addMinutes($setting->extended_minutes);
                if ($now->lessThan($extendedEnd)) continue;

                // Savādāk lietotājs tiek automātiski izrakstīts un pagarinājuma laiks tiek notīrīts
                $setting->user->clockOutAutomatically();
                $setting->update(['extended_minutes' => null]);
                continue;
            }

            // Ja šis brīdis ir vienāds vai vēlāk nekā darba beigu laiks un lietotājs joprojām ir pieslēdzies, tad automātiski tike izrakstīts
            if ($now->greaterThanOrEqualTo($workEnd) && $this->isUserClockedIn($setting->user)) {
                $this->info("→ Auto clock-out at end of day");
                $setting->user->clockOutAutomatically();
            }
        }

        $this->info('Auto clock executed at ' . now());
    }

    // Nosūta atgādinājuma e-pastu, ja nav jau nosūtīts derīgs tokens
    private function sendEmail($user, $type)
    {
        // Ja jau pastāv derīgs tokens šim lietotājam un darbības tipam, tad atgriež šo ierakstu
        $exists = AutoClockToken::where('user_id', $user->id)
            ->where('action_type', $type)
            ->where('expires_at', '>', now())
            ->exists();

        if ($exists) return;

        // Izveido jaunu tokenu
        $token = Str::random(32);
        // Saglabā tokenu datubāzē, priekš attiecīgā lietotāja un darbības tipa
        AutoClockToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'action_type' => $type,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Ja lietotāja izveidotā tokena darbības tips ir "clockin", tad nosūta pieslēgšanās e-pastu, savādāk nosūta izrakstīšanās e-pastu
        $type === 'clockin'
            ? Mail::to($user->email)->send(new ClockInReminderMail($user, $token))
            : Mail::to($user->email)->send(new ClockOutReminderMail($user, $token));

        $this->info("→ {$type} email sent to {$user->email}");
    }

    // Pārbauda, vai lietotājs jau ir pierakstijies
    private function isUserClockedIn($user)
    {
        return $user->timeLogs()->whereNull('clock_out')->exists();
    }
}

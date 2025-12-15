<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The relations to eager load on every query.
     *
     * @var list<string>
     */
    protected $with = ['profile'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function jobGroups()
    {
        return $this->belongsToMany(JobGroup::class, 'job_group_users');
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function ownedBusiness()
    {
        return $this->hasOne(Business::class, 'user_id');
    }

    public function businesses()
    {
        return $this->belongsToMany(Business::class, 'business_users');
    }

    public function business()
    {
        return $this->belongsToMany(Business::class, 'business_users')->limit(1);
    }

    public function timeLogs()
    {
        return $this->hasMany(TimeLog::class);
    }

    private function activeTimeLog()
    {
        return $this->timeLogs()
            ->whereNull('clock_out')
            ->latest()
            ->first();
    }

    public function clockInAutomatically()
    {
        if ($this->timeLogs()->whereNull('clock_out')->exists()) {
            return false;
        }

        $businessId = $this->businesses()->value('id');
        if (! $businessId) return false;

        $this->timeLogs()->create([
            'business_id' => $businessId,
            'clock_in'    => now(),
            'worked_time' => null,
        ]);

        return true;
    }

    private function secondsToHms(int $seconds): string
    {
        $seconds = abs($seconds);
        $h = intdiv($seconds, 3600);
        $m = intdiv($seconds % 3600, 60);
        $s = $seconds % 60;
        return sprintf('%02d:%02d:%02d', $h, $m, $s);
    }

    public function clockOutAutomatically()
    {
        $activeLog = $this->activeTimeLog();
        if (! $activeLog) return false;

        $clockIn  = Carbon::parse($activeLog->clock_in);
        $clockOut = now();

        $workedSeconds = abs($clockOut->diffInSeconds($clockIn));

        $activeLog->update([
            'clock_out'   => $clockOut,
            'worked_time' => $this->secondsToHms($workedSeconds),
        ]);

        return true;
    }

    public function pauseForLunch()
    {
        $activeLog = $this->activeTimeLog();
        if (! $activeLog) return false;

        $clockIn  = Carbon::parse($activeLog->clock_in);
        $clockOut = now();

        $workedSeconds = abs($clockOut->diffInSeconds($clockIn));

        $activeLog->update([
            'worked_time' => $this->secondsToHms($workedSeconds),
            'clock_out'   => $clockOut,
        ]);

        return true;
    }

    public function resumeAfterLunch()
    {
        $businessId = $this->businesses()->first()?->id;
        if (! $businessId) return false;

        $this->timeLogs()->create([
            'business_id' => $businessId,
            'clock_in'    => now(),
            'worked_time' => null,
        ]);

        return true;
    }
}

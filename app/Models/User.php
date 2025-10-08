<?php

namespace App\Models;

use Carbon\Carbon;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\HasOne;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        return $this->belongsToMany(Business::class, 'business_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function business()
    {
        return $this->belongsToMany(Business::class, 'business_users')
            ->withPivot('role')
            ->withTimestamps()
            ->limit(1);
    }

    public function timeLogs()
    {
        return $this->hasMany(TimeLog::class);
    }

    public function clockInAutomatically()
    {
        if ($this->timeLogs()->whereNull('clock_out')->exists()) {
            return false;
        }

        $businessId = $this->businesses()->first()?->id;

        if (! $businessId) {
            \Log::warning("User {$this->id} tried to clock in but has no assigned business.");
            return false;
        }

        $this->timeLogs()->create([
            'business_id' => $businessId,
            'clock_in' => now('Europe/Riga'),
            'worked_time' => null,
        ]);

        return true;
    }

    public function clockOutAutomatically()
    {
        $activeLog = $this->timeLogs()
            ->whereNull('clock_out')
            ->latest()
            ->first();

        if (! $activeLog) {
            return false;
        }

        $clockIn = Carbon::parse($activeLog->clock_in, 'Europe/Riga');
        $clockOut = now('Europe/Riga');

        $diffInSeconds = $clockOut->diffInSeconds($clockIn);

        $workedTime = gmdate('H:i:s', $diffInSeconds);

        $activeLog->update([
            'clock_out' => $clockOut,
            'worked_time' => $workedTime,
        ]);

        return true;
    }

    public function pauseForLunch()
    {
        $activeLog = $this->timeLogs()
            ->whereNull('clock_out')
            ->latest()
            ->first();

        if (! $activeLog) {
            return false;
        }

        $clockIn = Carbon::parse($activeLog->clock_in, 'Europe/Riga');
        $now = now('Europe/Riga');
        $elapsedSeconds = $now->diffInSeconds($clockIn);

        $previousSeconds = 0;
        if ($activeLog->worked_time) {
            [$h, $m, $s] = explode(':', $activeLog->worked_time);
            $previousSeconds = ($h * 3600) + ($m * 60) + $s;
        }

        $totalSeconds = $previousSeconds + $elapsedSeconds;
        $formattedTime = gmdate('H:i:s', $totalSeconds);

        $activeLog->update([
            'worked_time' => $formattedTime,
            'clock_out' => $now,
        ]);

        return true;
    }

    public function resumeAfterLunch()
    {
        $businessId = $this->businesses()->first()?->id;

        if (! $businessId) {
            \Log::warning("User {$this->id} tried to resume after lunch but has no assigned business.");
            return false;
        }

        $this->timeLogs()->create([
            'business_id' => $businessId,
            'clock_in' => now('Europe/Riga'),
            'worked_time' => 0,
        ]);

        return true;
    }
}

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

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
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
            ->orderByDesc('clock_in')
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
        ]);

        return true;
    }

    public function clockOutAutomatically()
    {
        $activeLog = $this->activeTimeLog();
        if (! $activeLog) return false;

        $activeLog->update([
            'clock_out'   => now(),
        ]);

        return true;
    }

    public function pauseForLunch()
    {
        $activeLog = $this->activeTimeLog();
        if (! $activeLog) return false;

        $activeLog->update([
            'clock_out'   => now(),
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
        ]);

        return true;
    }
}

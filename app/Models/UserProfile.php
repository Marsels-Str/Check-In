<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $fillable = [
        'age',
        'height',
        'weight',
        'phone',
        'personal_code',
        'country',
        'city',
        'portrait',
        'unique_id',
    ];

    protected static function booted()
    {
        static::creating(function ($profile) {
            do {
                $uniqueId = random_int(10000000, 99999999);
            } while (self::where('unique_id', $uniqueId)->exists());

            $profile->unique_id = $uniqueId;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

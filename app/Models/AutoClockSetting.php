<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AutoClockSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'work_start',
        'work_end',
        'lunch_start',
        'lunch_end',
        'extended_minutes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

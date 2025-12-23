<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = ['user_id', 'business_id', 'clock_in', 'clock_out'];

    protected function casts(): array
    {
        return [
            'clock_in'  => 'datetime',
            'clock_out' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}

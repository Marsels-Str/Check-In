<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    protected $fillable = ['business_id', 'job_group_id', 'name', 'lat', 'lng', 'radius', 'polygon', 'type'];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function jobGroup()
    {
        return $this->belongsTo(JobGroup::class);
    }
}

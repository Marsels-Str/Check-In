<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    protected $fillable = ['business_id', 'group_id', 'name', 'lat', 'lng', 'radius', 'polygon', 'type'];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}

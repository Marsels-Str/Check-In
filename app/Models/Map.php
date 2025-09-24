<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    protected $fillable = ['name', 'lat', 'lng', 'radius', 'polygon', 'type'];
}

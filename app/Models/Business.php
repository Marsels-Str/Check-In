<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'industry',
        'email',
        'phone',
        'country',
        'city',
        'street_address',
        'logo',
        'description',
        'employees',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function jobGroups()
    {
        return $this->hasMany(JobGroup::class);
    }

    public function maps()
    {
        return $this->hasMany(Map::class);
    }

    public function employees()
    {
        return $this->belongsToMany(User::class, 'business_users')->withTimestamps();
    }
}

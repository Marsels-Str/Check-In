<?php

namespace App\Models;

use App\Models\GroupImage;
use App\Models\GroupMessage;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['business_id', 'name', 'description'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    public function images()
    {
        return $this->hasMany(GroupImage::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function map()
    {
        return $this->hasOne(Map::class, 'group_id');
    }

    public function messages()
    {
        return $this->hasMany(GroupMessage::class, 'group_id');
    }
}

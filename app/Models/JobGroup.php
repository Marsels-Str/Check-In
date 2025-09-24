<?php

namespace App\Models;

use App\Models\GroupImage;
use Illuminate\Database\Eloquent\Model;

class JobGroup extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'job_group_user');
    }

    public function images()
    {
        return $this->hasMany(GroupImage::class);
    }
}

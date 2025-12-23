<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupImage extends Model
{
    protected $fillable = ['group_id', 'image_blob'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}

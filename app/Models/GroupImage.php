<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupImage extends Model
{
    protected $fillable = ['job_group_id', 'image_blob'];

    public function jobGroup()
    {
        return $this->belongsTo(JobGroup::class);
    }
}

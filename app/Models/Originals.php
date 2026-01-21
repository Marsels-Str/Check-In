<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Originals extends Model
{
    protected $table = 'originals';

    protected $fillable = ['key', 'text'];

    public function translations()
    {
        return $this->hasMany(Translations::class, 'originals_id');
    }
}

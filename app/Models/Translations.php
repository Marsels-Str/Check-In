<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Translations extends Model
{
    protected $table = 'translations';

    protected $fillable = ['originals_id', 'languages_id', 'translation',];

    public function original()
    {
        return $this->belongsTo(Originals::class, 'originals_id');
    }

    public function language()
    {
        return $this->belongsTo(Languages::class, 'languages_id');
    }
}

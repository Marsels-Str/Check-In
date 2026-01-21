<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Languages extends Model
{
    protected $table = 'languages';
    
    protected $fillable = ['name', 'code', 'translation_batch_id'];

    public function translations()
    {
        return $this->hasMany(Translations::class, 'languages_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    use HasFactory;

    protected $fillable = ['responsable_id', 'type', 'contenu', 'date_creation'];

    protected $casts = ['contenu' => 'array'];

    public function responsable()
    {
        return $this->belongsTo(Responsable::class);
    }
}

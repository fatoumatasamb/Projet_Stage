<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ressource extends Model
{
    use HasFactory;

    protected $fillable = ['tp_id', 'titre', 'fichier', 'description', 'date_depot'];

    public function tp()
    {
        return $this->belongsTo(Tp::class);
    }
}

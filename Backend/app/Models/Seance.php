<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model
{
    use HasFactory;

    protected $fillable = ['tp_id', 'salle_id', 'date', 'heure_debut', 'heure_fin'];

    public function tp()
    {
        return $this->belongsTo(Tp::class);
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}

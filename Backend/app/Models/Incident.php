<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'signale_par_id', 'technicien_id', 'materiel_id', 'salle_id',
        'quantite_materiel_affecte', 'description', 'statut', 'date_signalement',
    ];

    public function signalePar()
    {
        return $this->belongsTo(User::class, 'signale_par_id');
    }

    public function technicien()
    {
        return $this->belongsTo(Technicien::class);
    }

    public function materiel()
    {
        return $this->belongsTo(Materiel::class);
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }
}
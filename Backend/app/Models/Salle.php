<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'capacite', 'disponibilite'];

    protected $casts = ['disponibilite' => 'boolean'];

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}

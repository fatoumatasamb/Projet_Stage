<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tp extends Model
{
    use HasFactory;

    protected $table = 'tps';

    protected $fillable = ['enseignant_id', 'titre', 'description', 'date_creation', 'ufr', 'departement', 'filiere', 'niveau', 'groupe'];

    public function enseignant()
    {
        return $this->belongsTo(Enseignant::class);
    }

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }

    public function ressources()
    {
        return $this->hasMany(Ressource::class);
    }

    public function comptesRendus()
    {
        return $this->hasMany(CompteRendu::class);
    }
}

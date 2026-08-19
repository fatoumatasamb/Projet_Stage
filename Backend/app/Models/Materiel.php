<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'type', 'categorie', 'disponibilite', 'quantite', 'etat'];

    protected $casts = ['disponibilite' => 'boolean'];

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }
        public function materiels()
    {
        return $this->belongsToMany(Materiel::class, 'tp_materiel')
            ->withPivot('quantite')
            ->withTimestamps();
    }
}
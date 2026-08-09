<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

protected $fillable = ['user_id', 'description', 'groupe', 'date_inscription', 'ufr', 'departement', 'filiere', 'niveau'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comptesRendus()
    {
        return $this->hasMany(CompteRendu::class);
    }
}

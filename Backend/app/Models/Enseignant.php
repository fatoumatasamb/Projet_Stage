<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseignant extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'specialite', 'disponibilite'];

    protected $casts = ['disponibilite' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tps()
    {
        return $this->hasMany(Tp::class);
    }
}

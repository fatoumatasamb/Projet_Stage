<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technicien extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'matricule'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }
}

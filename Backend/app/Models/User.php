<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\VerifyEmailNotification;

// Représente la classe abstraite "Intervenant" du diagramme de classes.
// Le champ `role` détermine le profil concret (Enseignant / Etudiant / Technicien / Responsable).
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom', 'prenom', 'email', 'password', 'telephone', 'adresse', 'role', 'statut',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailNotification());
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function enseignant()
    {
        return $this->hasOne(Enseignant::class);
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class);
    }

    public function technicien()
    {
        return $this->hasOne(Technicien::class);
    }

    public function responsable()
    {
        return $this->hasOne(Responsable::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function isActif(): bool
    {
        return $this->statut === 'actif';
    }
}
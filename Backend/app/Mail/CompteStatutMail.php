<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompteStatutMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $statut; // 'valide' ou 'rejete'

    public function __construct(User $user, string $statut)
    {
        $this->user = $user;
        $this->statut = $statut;
    }

    public function build()
    {
        $subject = $this->statut === 'valide'
            ? 'Votre compte responsable a ete valide'
            : 'Votre inscription en tant que responsable a ete rejetee';

        return $this->subject($subject)->view('emails.compte-statut');
    }
}
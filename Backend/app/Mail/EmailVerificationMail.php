<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

   public function build()
    {
        $lien = rtrim(config('app.url'), '/') . '/api/verifier-email/' . $this->user->verification_token;

        return $this->subject('Confirmez votre inscription - LabTPAD')
            ->view('emails.verification')
            ->with(['user' => $this->user, 'lien' => $lien]);
    }
}
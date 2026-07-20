<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends BaseVerifyEmail
{
    /**
     * Construit l'URL de vérification, mais pointant vers une page React
     * (le frontend) plutôt que directement vers l'API Laravel.
     */
    protected function verificationUrl($notifiable)
    {
        $apiUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );

        // On récupère uniquement la partie "signature=...&expires=..." de l'URL signée Laravel
        $query = parse_url($apiUrl, PHP_URL_QUERY);
        $frontendUrl = config('app.frontend_url');
        $hash = sha1($notifiable->getEmailForVerification());

        return "{$frontendUrl}/verifier-email/{$notifiable->getKey()}/{$hash}?{$query}";
    }

    /**
     * Personnalise le contenu de l'email (en français, avec le nom LabTPAD).
     */
    public function toMail($notifiable)
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Vérifiez votre adresse email - LabTPAD')
            ->greeting('Bonjour ' . $notifiable->nom . ' ' . $notifiable->prenom . ',')
            ->line('Merci de vous être inscrit(e) sur LabTPAD.')
            ->line('Veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.')
            ->action('Vérifier mon email', $url)
            ->line('Ce lien expire dans 60 minutes.')
            ->line('Si vous n\'avez pas créé de compte, aucune action n\'est requise.');
    }
}
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #1a1a2e;">
    <h2>Bonjour {{ $user->nom }} {{ $user->prenom }},</h2>

    <p>Merci de vous etre inscrit(e) sur LabTPAD en tant que <strong>{{ $user->role }}</strong>.</p>
    <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>

    <p style="margin: 24px 0;">
        <a href="{{ $lien }}" style="background:#1a1a2e; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px;">
            Confirmer mon inscription
        </a>
    </p>

    <p style="font-size: 12px; color: #888;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
        {{ $lien }}
    </p>

    <p style="margin-top: 20px; font-size: 12px; color: #888;">LabTPAD - Universite de Thies</p>
</body>
</html>
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #1a1a2e;">
    <h2>Bonjour {{ $user->nom }} {{ $user->prenom }},</h2>

    @if($statut === 'valide')
        <p>Bonne nouvelle : votre inscription en tant que <strong>responsable</strong> sur LabTPAD a ete validee.</p>
        <p>Vous pouvez desormais vous connecter avec votre email et votre mot de passe.</p>
    @else
        <p>Nous vous informons que votre demande d'inscription en tant que <strong>responsable</strong> sur LabTPAD a ete rejetee par un administrateur.</p>
        <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administration.</p>
    @endif

    <p style="margin-top: 20px; font-size: 12px; color: #888;">LabTPAD - Universite de Thies</p>
</body>
</html>
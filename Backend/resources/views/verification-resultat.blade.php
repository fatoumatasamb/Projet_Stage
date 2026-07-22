<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 60px 20px; background: #f4f4f7;">
    <div style="max-width: 420px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        @if($succes)
            <h2 style="color: #16a34a;">Compte valide !</h2>
        @else
            <h2 style="color: #dc2626;">Lien invalide</h2>
        @endif
        <p style="color: #333;">{{ $message }}</p>
    </div>
</body>
</html>
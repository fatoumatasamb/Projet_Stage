<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\Responsable;
use App\Models\Technicien;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * S'inscrire (use case "S'inscrire" -> include "Validation automatique").
     * Un email de vérification est envoyé automatiquement.
     * Le compte n'est utilisable qu'après confirmation du lien reçu par email.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => [
                'required',
                'email',
                'unique:users,email',
                'regex:/^[\w\.\-]+@univ-thies\.sn$/i',
            ],
            'password' => 'required|string|min:6|confirmed',
            'telephone' => 'nullable|string|max:30',
            'adresse' => 'nullable|string|max:255',
            'role' => 'required|in:enseignant,etudiant,technicien,responsable',
            'specialite' => 'nullable|string',
            'groupe' => 'nullable|string',
            'matricule' => 'nullable|string',
        ]);

        $validator->after(function ($validator) use ($request) {
            $email = $request->input('email');
            if ($email && ! str_ends_with(strtolower($email), '@univ-thies.sn')) {
                $validator->errors()->add(
                    'email',
                    "Seules les adresses email de l'université (@univ-thies.sn) peuvent s'inscrire elles-mêmes. Contactez un responsable pour un accès avec une autre adresse."
                );
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $autoValidatedRoles = ['etudiant', 'enseignant', 'technicien'];
        $statut = in_array($request->role, $autoValidatedRoles, true) ? 'actif' : 'en_attente';

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'role' => $request->role,
            'statut' => $statut,
        ]);

        match ($request->role) {
            'enseignant' => Enseignant::create([
                'user_id' => $user->id,
                'specialite' => $request->specialite,
                'disponibilite' => true,
            ]),
            'etudiant' => Etudiant::create([
                'user_id' => $user->id,
                'groupe' => $request->groupe,
                'date_inscription' => now(),
            ]),
            'technicien' => Technicien::create([
                'user_id' => $user->id,
                'matricule' => $request->matricule,
            ]),
            'responsable' => Responsable::create([
                'user_id' => $user->id,
                'date_nomination' => now(),
            ]),
        };

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Inscription réussie. Un email de vérification vous a été envoyé.',
            'email' => $user->email,
        ], 201);
    }

    /**
     * Traite le clic sur le lien de vérification reçu par email.
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Lien de vérification invalide.'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email déjà vérifié. Vous pouvez vous connecter.']);
        }

        $user->markEmailAsVerified();

        return response()->json(['message' => 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.']);
    }

    /**
     * Renvoie un nouvel email de vérification si l'utilisateur n'a pas reçu/cliqué le premier.
     */
    public function resendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return response()->json(['message' => 'Aucun compte trouvé avec cet email.'], 404);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Ce compte est déjà vérifié.']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Email de vérification renvoyé.']);
    }

    // Se connecter
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Veuillez vérifier votre adresse email avant de vous connecter.'], 403);
        }

        if ($user->statut === 'suspendu') {
            return response()->json(['message' => 'Ce compte a été suspendu.'], 403);
        }

        if ($user->statut === 'en_attente') {
            return response()->json(['message' => 'Ce compte est en attente de validation.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load($user->role),
            'token' => $token,
        ]);
    }

    // Se déconnecter
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load($request->user()->role));
    }

    // Modifier profil
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:30',
            'adresse' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user);
    }
}
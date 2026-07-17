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
use App\Models\Notification;

class AuthController extends Controller
{
    /**
     * S'inscrire (use case "S'inscrire" -> include "Validation automatique").
     * Les étudiants et enseignants sont activés automatiquement ;
     * les comptes techniciens / responsables restent en_attente et doivent être validés
     * par un Responsable (use case "Valider compte").
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
            // champs spécifiques
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

        // Seul le compte Responsable nécessite une validation manuelle
        // (un enseignant, par exemple, peut aussi devenir responsable : ce rôle sensible
        // reste donc soumis à validation par un responsable déjà actif).
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
                'description' => $request->description,
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

     if ($statut !== 'actif') {
            // Notifier tous les responsables actifs qu'un nouveau compte responsable attend validation
            $responsablesActifs = User::where('role', 'responsable')->where('statut', 'actif')->get();
            foreach ($responsablesActifs as $r) {
                Notification::create([
                    'user_id' => $r->id,
                    'type' => 'inscription_responsable',
                    'message' => "{$user->nom} {$user->prenom} s'est inscrit en tant que responsable et attend validation.",
                    'lien' => '/responsable/utilisateurs',
                ]);
            }

            return response()->json([
                'message' => 'Compte créé. En attente de validation par un responsable.',
            ], 201);
        }

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user->load($request->role),
        ], 201);
    }

    // Se connecter

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

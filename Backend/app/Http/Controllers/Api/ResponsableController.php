<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rapport;
use App\Models\User;
use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\Responsable;
use App\Models\Technicien;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Mail\CompteStatutMail;
use Illuminate\Support\Facades\Mail;

// Regroupe les use cases du Responsable : Gérer utilisateurs, Valider/Suspendre compte,
// Consulter statistiques, Interagir avec les intervenants.
class ResponsableController extends Controller
{
    // Gérer les utilisateurs (liste + filtres)
    public function utilisateurs(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        return response()->json($query->with(['enseignant', 'etudiant', 'technicien', 'responsable'])->paginate(20));
    }

    // Créer un compte (le Responsable peut inscrire n'importe quelle adresse email,
    // contrairement à l'auto-inscription publique réservée à @univ-thies.sn)
    public function creerUtilisateur(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'telephone' => 'nullable|string|max:30',
            'adresse' => 'nullable|string|max:255',
            'role' => 'required|in:enseignant,etudiant,technicien,responsable',
            'specialite' => 'nullable|string',
            'groupe' => 'nullable|string',
            'matricule' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telephone' => $request->telephone,
            'adresse' => $request->adresse,
            'role' => $request->role,
            'statut' => 'actif',
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

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user->load($request->role),
        ], 201);
    }

  public function validerCompte(User $user)
    {
        $user->statut = 'actif';

        // La validation manuelle par un responsable fait aussi office de verification d'email :
        // l'utilisateur pourrait ne jamais avoir clique sur le lien recu par mail.
        if (! $user->hasVerifiedEmail()) {
            $user->email_verified_at = now();
        }

        $user->save();

        Mail::to($user->email)->send(new CompteStatutMail($user, 'valide'));

        return response()->json(['message' => 'Compte validé.', 'user' => $user]);
    }

    // Rejeter une demande d'inscription (compte encore en_attente)
    public function rejeterCompte(User $user)
    {
        abort_if($user->statut !== 'en_attente', 422, 'Seul un compte en attente peut être rejeté.');

        Mail::to($user->email)->send(new CompteStatutMail($user, 'rejete'));

        $user->delete();

        return response()->json(['message' => 'Inscription rejetée.']);
    }

    // Suspendre compte (compte déjà actif)
    public function suspendreCompte(User $user)
    {
        $user->update(['statut' => 'suspendu']);

        return response()->json(['message' => 'Compte suspendu.', 'user' => $user]);
    }

    // Supprimer un utilisateur
    public function supprimerUtilisateur(Request $request, User $user)
    {
        abort_if($user->id === $request->user()->id, 422, 'Vous ne pouvez pas supprimer votre propre compte.');

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    // Consulter statistiques (génère un rapport simple à la volée)
    public function statistiques(Request $request)
    {
        $stats = [
            'total_utilisateurs' => User::count(),
            'total_enseignants' => User::where('role', 'enseignant')->count(),
            'total_etudiants' => User::where('role', 'etudiant')->count(),
            'total_techniciens' => User::where('role', 'technicien')->count(),
            'comptes_en_attente' => User::where('statut', 'en_attente')->count(),
            'comptes_suspendus' => User::where('statut', 'suspendu')->count(),
            'total_tps' => \App\Models\Tp::count(),
            'total_seances' => \App\Models\Seance::count(),
            'total_comptes_rendus' => \App\Models\CompteRendu::count(),
            'total_reservations' => \App\Models\Reservation::count(),
            'incidents_ouverts' => \App\Models\Incident::whereIn('statut', ['signale', 'en_cours'])->count(),
        ];

        // Sauvegarde du rapport pour historique (use case "Consulter statistiques")
        $responsable = $request->user()->responsable;
        if ($responsable) {
            Rapport::create([
                'responsable_id' => $responsable->id,
                'type' => 'statistiques_generales',
                'contenu' => $stats,
                'date_creation' => now(),
            ]);
        }

        return response()->json($stats);
    }

    public function rapports(Request $request)
    {
        $responsable = $request->user()->responsable;

        return response()->json($responsable?->rapports()->latest()->paginate(20));
    }
}

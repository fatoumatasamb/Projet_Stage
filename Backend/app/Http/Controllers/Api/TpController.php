<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Tp;
use App\Models\User;
use Illuminate\Http\Request;

// Use cases Enseignant : Ajouter TP, Supprimer TP ; Etudiant : Consulter TP
class TpController extends Controller
{
    

         public function index(Request $request)
    {
        $query = Tp::with(['enseignant.user', 'seances', 'ressources', 'comptesRendus', 'materiels'])
            ->withCount('materiels');

        if ($request->boolean('mine') && $request->user()->role === 'enseignant') {
            $query->where('enseignant_id', $request->user()->enseignant->id);
        }

        if ($request->user()->role === 'etudiant') {
            $etudiant = $request->user()->etudiant;
            $query->where('ufr', $etudiant->ufr)
                ->where('departement', $etudiant->departement)
                ->where('filiere', $etudiant->filiere)
                ->where('niveau', $etudiant->niveau)
                ->where(function ($q) use ($etudiant) {
                    $q->whereNull('groupe')->orWhere('groupe', $etudiant->groupe);
                });
        }

        return response()->json($query->latest()->paginate(15));
    }

   public function show(Request $request, Tp $tp)
    {
        // Un enseignant ne peut consulter que le detail de ses propres TP.
        if ($request->user()->role === 'enseignant') {
            $enseignant = $request->user()->enseignant;
            if (! $enseignant || $tp->enseignant_id !== $enseignant->id) {
                abort(403, "Vous n'êtes pas l'auteur de ce TP.");
            }
        }

        return response()->json($tp->load(['enseignant.user', 'seances.salle', 'ressources', 'comptesRendus.etudiant.user' , 'materiels']));
    }

    // Ajouter TP + notifier les etudiants concernes (meme ufr/departement/filiere/niveau)
    public function store(Request $request)
    {
       $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ufr' => 'required|string',
            'departement' => 'required|string',
            'filiere' => 'required|string',
            'niveau' => 'required|string',
            'groupe' => 'nullable|string',
        ]);

        $data['enseignant_id'] = $request->user()->enseignant->id;
        $data['date_creation'] = now();

        $tp = Tp::create($data)->load('enseignant.user');

        $this->notifierEtudiantsConcernes($tp);

        return response()->json($tp, 201);
    }

    public function update(Request $request, Tp $tp)
    {
        $this->authorizeOwner($request, $tp);

        $data = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'ufr' => 'nullable|string',
            'departement' => 'nullable|string',
            'filiere' => 'nullable|string',
            'niveau' => 'nullable|string',
            'groupe' => 'nullable|string',
        ]);

        $tp->update($data);

        return response()->json($tp);
    }

    public function destroy(Request $request, Tp $tp)
    {
        $this->authorizeOwner($request, $tp);
        $tp->delete();

        return response()->json(['message' => 'TP supprimé.']);
    }

    private function authorizeOwner(Request $request, Tp $tp): void
    {
        $enseignant = $request->user()->enseignant;
        if (! $enseignant || $tp->enseignant_id !== $enseignant->id) {
            abort(403, "Vous n'êtes pas l'auteur de ce TP.");
        }
    }

    // Notifie tous les etudiants actifs dont le profil (ufr/departement/filiere/niveau)
    // correspond exactement a celui du TP nouvellement cree.
   private function notifierEtudiantsConcernes(Tp $tp): void
    {
        // Coherent avec le filtre d'affichage : correspondance exacte requise sur
        // ufr/departement/filiere/niveau (le groupe reste optionnel).
        $etudiants = User::where('role', 'etudiant')
            ->where('statut', 'actif')
            ->whereHas('etudiant', function ($q) use ($tp) {
                $q->where('ufr', $tp->ufr)
                    ->where('departement', $tp->departement)
                    ->where('filiere', $tp->filiere)
                    ->where('niveau', $tp->niveau)
                    ->where(function ($q2) use ($tp) {
                        $q2->whereNull('groupe')->orWhere('groupe', $tp->groupe);
                    });
            })
            ->get();

        foreach ($etudiants as $etudiant) {
            Notification::create([
                'user_id' => $etudiant->id,
                'type' => 'nouveau_tp',
                'message' => "Un nouveau TP « {$tp->titre} » a ete publie pour votre filiere.",
                'lien' => '/etudiant',
            ]);
        }
    }


        // Sélectionner les matériels nécessaires pour un TP (avec quantité requise pour chacun)
    public function materiels(Request $request, Tp $tp)
    {
        $this->authorizeOwner($request, $tp);

        $data = $request->validate([
            'materiels' => 'array',
            'materiels.*.materiel_id' => 'required|exists:materiels,id',
            'materiels.*.quantite' => 'required|integer|min:1',
        ]);

        $syncData = collect($data['materiels'] ?? [])
            ->mapWithKeys(fn ($m) => [$m['materiel_id'] => ['quantite' => $m['quantite']]])
            ->toArray();

        $tp->materiels()->sync($syncData);

        return response()->json($tp->load('materiels'));
    }
}
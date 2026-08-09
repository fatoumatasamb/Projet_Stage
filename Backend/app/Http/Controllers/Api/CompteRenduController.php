<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompteRendu;
use App\Models\Tp;
use Illuminate\Http\Request;

// Déposer un compte rendu (Etudiant) ; Consulter compte rendu / Noter Étudiant (Enseignant)
class CompteRenduController extends Controller
{
    public function index(Request $request, Tp $tp)
    {
        $user = $request->user();

        // Un enseignant ne peut consulter les comptes rendus que de ses propres TP.
        if ($user->role === 'enseignant') {
            $enseignant = $user->enseignant;
            if (! $enseignant || $tp->enseignant_id !== $enseignant->id) {
                abort(403, "Vous n'êtes pas l'auteur de ce TP.");
            }
        }

        $query = $tp->comptesRendus()->with('etudiant.user');

        // Un étudiant ne voit que ses propres comptes rendus
        if ($user->role === 'etudiant') {
            $query->where('etudiant_id', $user->etudiant->id);
        }

        return response()->json($query->latest()->get());
    }

    // Déposer un compte rendu
    public function store(Request $request, Tp $tp)
    {
        $etudiant = $request->user()->etudiant;
        abort_if(! $etudiant, 403, 'Seuls les étudiants peuvent déposer un compte rendu.');

        $data = $request->validate([
            'fichier' => 'required|file|max:20480',
        ]);

        $path = $request->file('fichier')->store('comptes_rendus', 'public');

        $compteRendu = CompteRendu::create([
            'etudiant_id' => $etudiant->id,
            'tp_id' => $tp->id,
            'fichier' => $path,
            'date_depot' => now(),
            'statut' => 'depose',
        ]);

        return response()->json($compteRendu, 201);
    }

    // Noter Étudiant / Valider compte rendu (Enseignant)
    public function noter(Request $request, CompteRendu $compteRendu)
    {
        $user = $request->user();

        // Un enseignant ne peut noter que les comptes rendus de ses propres TP.
        if ($user->role === 'enseignant') {
            $enseignant = $user->enseignant;
            $tp = $compteRendu->tp;
            if (! $enseignant || ! $tp || $tp->enseignant_id !== $enseignant->id) {
                abort(403, "Vous n'êtes pas l'auteur du TP concerné par ce compte rendu.");
            }
        }

        $data = $request->validate([
            'note' => 'required|numeric|min:0|max:20',
            'statut' => 'required|in:valide,refuse',
        ]);

        $compteRendu->update($data);

        return response()->json($compteRendu);
    }

    // Consulter notes (Etudiant)
    public function mesNotes(Request $request)
    {
        $etudiant = $request->user()->etudiant;
        abort_if(! $etudiant, 403);

        return response()->json(
            $etudiant->comptesRendus()->with('tp')->whereNotNull('note')->latest()->get()
        );
    }
}
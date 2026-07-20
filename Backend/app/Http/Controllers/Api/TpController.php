<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tp;
use Illuminate\Http\Request;

// Use cases Enseignant : Ajouter TP, Supprimer TP ; Etudiant : Consulter TP
class TpController extends Controller
{
    public function index(Request $request)
    {
        $query = Tp::with(['enseignant.user', 'seances', 'ressources', 'comptesRendus']);

        // Un enseignant ne voit par défaut que ses propres TP via ?mine=1
        if ($request->boolean('mine') && $request->user()->role === 'enseignant') {
            $query->where('enseignant_id', $request->user()->enseignant->id);
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Tp $tp)
    {
        return response()->json($tp->load(['enseignant.user', 'seances.salle', 'ressources', 'comptesRendus.etudiant.user']));
    }

    // Ajouter TP
    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $data['enseignant_id'] = $request->user()->enseignant->id;
        $data['date_creation'] = now();

        return response()->json(Tp::create($data)->load('enseignant.user'), 201);
    }

    public function update(Request $request, Tp $tp)
    {
        $this->authorizeOwner($request, $tp);

        $data = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $tp->update($data);

        return response()->json($tp);
    }

    // Supprimer TP
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
}

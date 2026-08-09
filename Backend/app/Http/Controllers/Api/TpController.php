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

        if ($request->boolean('mine') && $request->user()->role === 'enseignant') {
            $query->where('enseignant_id', $request->user()->enseignant->id);
        }

        if ($request->user()->role === 'etudiant') {
            $etudiant = $request->user()->etudiant;
            $query->where(function ($q) use ($etudiant) {
                $q->whereNull('departement')->orWhere('departement', $etudiant->departement);
            })->where(function ($q) use ($etudiant) {
                $q->whereNull('filiere')->orWhere('filiere', $etudiant->filiere);
            })->where(function ($q) use ($etudiant) {
                $q->whereNull('niveau')->orWhere('niveau', $etudiant->niveau);
            })->where(function ($q) use ($etudiant) {
                $q->whereNull('groupe')->orWhere('groupe', $etudiant->groupe);
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function show(Tp $tp)
    {
        return response()->json($tp->load(['enseignant.user', 'seances.salle', 'ressources', 'comptesRendus.etudiant.user']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'departement' => 'nullable|string',
            'filiere' => 'nullable|string',
            'niveau' => 'nullable|string',
            'groupe' => 'nullable|string',
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
}
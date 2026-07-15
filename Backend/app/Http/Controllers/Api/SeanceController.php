<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\Tp;
use Illuminate\Http\Request;

// Planifier une séance (Enseignant)
class SeanceController extends Controller
{
    public function index(Tp $tp)
    {
        return response()->json($tp->seances()->with('salle')->orderBy('date')->get());
    }

    public function store(Request $request, Tp $tp)
    {
        $enseignant = $request->user()->enseignant;
        if (! $enseignant || $tp->enseignant_id !== $enseignant->id) {
            abort(403, "Vous n'êtes pas l'auteur de ce TP.");
        }

        $data = $request->validate([
            'salle_id' => 'nullable|exists:salles,id',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
        ]);

        $data['tp_id'] = $tp->id;

        return response()->json(Seance::create($data)->load('salle'), 201);
    }

    public function update(Request $request, Seance $seance)
    {
        $data = $request->validate([
            'salle_id' => 'nullable|exists:salles,id',
            'date' => 'sometimes|date',
            'heure_debut' => 'sometimes|date_format:H:i',
            'heure_fin' => 'sometimes|date_format:H:i',
        ]);

        $seance->update($data);

        return response()->json($seance);
    }

    public function destroy(Seance $seance)
    {
        $seance->delete();

        return response()->json(['message' => 'Séance supprimée.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ressource;
use App\Models\Tp;
use Illuminate\Http\Request;

// Déposer ressource (Enseignant)
class RessourceController extends Controller
{
    public function index(Tp $tp)
    {
        return response()->json($tp->ressources()->latest()->get());
    }

    public function store(Request $request, Tp $tp)
    {
        $enseignant = $request->user()->enseignant;
        if (! $enseignant || $tp->enseignant_id !== $enseignant->id) {
            abort(403, "Vous n'êtes pas l'auteur de ce TP.");
        }

        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'fichier' => 'nullable|file|max:20480',
        ]);

        if ($request->hasFile('fichier')) {
            $data['fichier'] = $request->file('fichier')->store('ressources', 'public');
        }

        $data['tp_id'] = $tp->id;
        $data['date_depot'] = now();

        return response()->json(Ressource::create($data), 201);
    }

    public function destroy(Ressource $ressource)
    {
        $ressource->delete();

        return response()->json(['message' => 'Ressource supprimée.']);
    }
}

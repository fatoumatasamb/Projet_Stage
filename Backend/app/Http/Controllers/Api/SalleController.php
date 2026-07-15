<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;

// Gérer les salles (Responsable) / Consulter la disponibilité (Enseignant, Etudiant)
class SalleController extends Controller
{
    public function index()
    {
        return response()->json(Salle::orderBy('nom')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
            'disponibilite' => 'boolean',
        ]);

        return response()->json(Salle::create($data), 201);
    }

    public function update(Request $request, Salle $salle)
    {
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'capacite' => 'sometimes|integer|min:1',
            'disponibilite' => 'boolean',
        ]);

        $salle->update($data);

        return response()->json($salle);
    }

    public function destroy(Salle $salle)
    {
        $salle->delete();

        return response()->json(['message' => 'Salle supprimée.']);
    }
}

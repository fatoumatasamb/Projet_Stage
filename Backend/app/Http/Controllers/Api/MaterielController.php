<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materiel;
use Illuminate\Http\Request;

// Gérer les ressources matérielles et pédagogiques (Responsable)
// Gérer les équipements / Mettre à jour les ressources techniques (Technicien)
class MaterielController extends Controller
{
    public function index()
    {
        return response()->json(Materiel::orderBy('nom')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'disponibilite' => 'boolean',
            'quantite' => 'required|integer|min:0',
            'etat' => 'nullable|string|max:255',
        ]);

        return response()->json(Materiel::create($data), 201);
    }

    public function update(Request $request, Materiel $materiel)
    {
        $data = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'type' => 'nullable|string|max:255',
            'disponibilite' => 'boolean',
            'quantite' => 'sometimes|integer|min:0',
            'etat' => 'nullable|string|max:255',
        ]);

        $materiel->update($data);

        return response()->json($materiel);
    }

    public function destroy(Materiel $materiel)
    {
        $materiel->delete();

        return response()->json(['message' => 'Matériel supprimé.']);
    }
}

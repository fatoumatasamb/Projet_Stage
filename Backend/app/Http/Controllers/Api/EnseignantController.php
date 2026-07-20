<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enseignant;
use Illuminate\Http\Request;

// Interagir avec les intervenants (Responsable) - vue liste des enseignants
class EnseignantController extends Controller
{
    public function index()
    {
        return response()->json(Enseignant::with('user')->get());
    }

    // Proposer matériel pédagogique
    public function updateDisponibilite(Request $request, Enseignant $enseignant)
    {
        $data = $request->validate(['disponibilite' => 'required|boolean']);
        $enseignant->update($data);

        return response()->json($enseignant);
    }
}

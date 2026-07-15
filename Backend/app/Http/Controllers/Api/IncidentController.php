<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;

// Signaler (tous) -> Responsable recoit -> transmet au Technicien -> Technicien traite/resout
class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Incident::with(['materiel', 'salle', 'technicien.user', 'signalePar']);

        $user = $request->user();

        if ($user->role === 'technicien') {
            $query->whereIn('statut', ['transmis', 'en_cours', 'resolu']);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'materiel_id' => 'nullable|exists:materiels,id',
            'salle_id' => 'nullable|exists:salles,id',
            'description' => 'required|string',
        ]);

        $user = $request->user();
        $data['signale_par_id'] = $user->id;
        $data['date_signalement'] = now();
        $data['statut'] = $user->role === 'responsable' ? 'transmis' : 'signale';

        return response()->json(Incident::create($data)->load('signalePar'), 201);
    }

    public function transmettre(Request $request, Incident $incident)
    {
        abort_if($incident->statut !== 'signale', 422, 'Cet incident a deja ete transmis ou traite.');

        $incident->update(['statut' => 'transmis']);

        return response()->json($incident);
    }

    public function update(Request $request, Incident $incident)
    {
        abort_if($incident->statut === 'signale', 403, "Cet incident n'a pas encore ete transmis par le responsable.");

        $data = $request->validate([
            'statut' => 'required|in:transmis,en_cours,resolu',
        ]);

        if ($request->user()->role === 'technicien') {
            $data['technicien_id'] = $request->user()->technicien->id;
        }

        $incident->update($data);

        return response()->json($incident);
    }
}
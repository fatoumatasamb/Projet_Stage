<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

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
            'quantite_materiel_affecte' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();
        $data['signale_par_id'] = $user->id;
        $data['date_signalement'] = now();
        $data['statut'] = $user->role === 'responsable' ? 'transmis' : 'signale';

        $incident = Incident::create($data)->load('signalePar');

        if ($incident->statut === 'signale') {
            $this->notifier(
                User::where('role', 'responsable')->where('statut', 'actif')->get(),
                'incident_signale',
                "Nouvel incident signalé par {$user->nom} : {$this->resume($incident->description)}",
                '/responsable/incidents',
                $incident->id
            );
        } else {
            $this->notifier(
                User::where('role', 'technicien')->where('statut', 'actif')->get(),
                'incident_transmis',
                "Le responsable a signalé un incident : {$this->resume($incident->description)}",
                '/technicien/incidents',
                $incident->id
            );
        }

        return response()->json($incident, 201);
    }

    public function transmettre(Request $request, Incident $incident)
    {
        abort_if($incident->statut !== 'signale', 422, 'Cet incident a déjà été transmis ou traité.');

        $incident->update(['statut' => 'transmis']);

        $this->notifier(
            User::where('role', 'technicien')->where('statut', 'actif')->get(),
            'incident_transmis',
            "Un incident vous a été transmis par le responsable : {$this->resume($incident->description)}",
            '/technicien/incidents',
            $incident->id
        );

        return response()->json($incident);
    }

    public function update(Request $request, Incident $incident)
    {
        abort_if($incident->statut === 'signale', 403, "Cet incident n'a pas encore été transmis par le responsable.");

        $data = $request->validate([
            'statut' => 'required|in:transmis,en_cours,resolu',
        ]);

        if ($request->user()->role === 'technicien') {
            $data['technicien_id'] = $request->user()->technicien->id;
        }

        $incident->update($data);

        return response()->json($incident);
    }

    private function notifier($users, string $type, string $message, string $lien, int $incidentId): void
    {
        foreach ($users as $u) {
            Notification::create([
                'user_id' => $u->id,
                'type' => $type,
                'message' => $message,
                'lien' => $lien,
                'incident_id' => $incidentId,
            ]);
        }
    }

    private function resume(string $texte): string
    {
        return mb_strlen($texte) > 60 ? mb_substr($texte, 0, 60).'…' : $texte;
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

// Réserver un créneau / Accéder au laboratoire (Enseignant, Etudiant)
class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Reservation::with(['salle', 'user']);

        if (! in_array($user->role, ['responsable', 'technicien'], true)) {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->orderBy('date')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
        ]);

        $conflit = Reservation::where('salle_id', $data['salle_id'])
            ->where('date', $data['date'])
            ->where('statut', '!=', 'annulee')
            ->where(function ($q) use ($data) {
                $q->whereBetween('heure_debut', [$data['heure_debut'], $data['heure_fin']])
                  ->orWhereBetween('heure_fin', [$data['heure_debut'], $data['heure_fin']]);
            })->exists();

        if ($conflit) {
            return response()->json(['message' => 'Ce créneau est déjà réservé pour cette salle.'], 409);
        }

        $data['user_id'] = $request->user()->id;
        $data['statut'] = 'confirmee';

        return response()->json(Reservation::create($data)->load('salle'), 201);
    }

    public function destroy(Request $request, Reservation $reservation)
    {
        abort_if($reservation->user_id !== $request->user()->id && $request->user()->role !== 'responsable', 403);

        $reservation->update(['statut' => 'annulee']);

        return response()->json(['message' => 'Réservation annulée.']);
    }
}

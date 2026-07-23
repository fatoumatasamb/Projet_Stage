<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompteRenduController;
use App\Http\Controllers\Api\EnseignantController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\MaterielController;
use App\Http\Controllers\Api\ResponsableController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RessourceController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\TpController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API — LabTPAD
|--------------------------------------------------------------------------
| Toutes les routes sont préfixées par /api (voir bootstrap/app.php)
*/

// ---- Authentification (use cases "Se connecter" / "S'inscrire") ----
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---- Vérification d'email (use case "S'inscrire" -> include "Validation automatique") ----
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed')
    ->name('verification.verify');
Route::post('/email/resend', [AuthController::class, 'resendVerification']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ---- Salles : consultation ouverte à tous les intervenants connectés ----
    Route::get('/salles', [SalleController::class, 'index']);

    // ---- Matériels : consultation ouverte ----
    Route::get('/materiels', [MaterielController::class, 'index']);

    // ---- TP (Enseignant: CRUD sur les siens, Etudiant/Technicien/Responsable: lecture) ----
    Route::get('/tps', [TpController::class, 'index']);
    Route::get('/tps/{tp}', [TpController::class, 'show']);
    Route::get('/tps/{tp}/seances', [SeanceController::class, 'index']);
    Route::get('/tps/{tp}/ressources', [RessourceController::class, 'index']);
    Route::get('/tps/{tp}/comptes-rendus', [CompteRenduController::class, 'index']);

    // ---- Incidents : consultation + signalement ouverts à tous ----
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::post('/incidents', [IncidentController::class, 'store']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/lu', [NotificationController::class, 'marquerLu']);
    Route::post('/notifications/lues', [NotificationController::class, 'marquerToutesLues']);

    // =====================  ENSEIGNANT  =====================
    Route::middleware('role:enseignant')->group(function () {
           // ---- Réservations (Enseignant, Etudiant) ----
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);
        Route::post('/tps', [TpController::class, 'store']);              // Ajouter TP
        Route::put('/tps/{tp}', [TpController::class, 'update']);
        Route::delete('/tps/{tp}', [TpController::class, 'destroy']);     // Supprimer TP

        Route::post('/tps/{tp}/seances', [SeanceController::class, 'store']);     // Planifier une séance
        Route::put('/seances/{seance}', [SeanceController::class, 'update']);
        Route::delete('/seances/{seance}', [SeanceController::class, 'destroy']);

        Route::post('/tps/{tp}/ressources', [RessourceController::class, 'store']); // Déposer ressource
        Route::delete('/ressources/{ressource}', [RessourceController::class, 'destroy']);

        Route::post('/comptes-rendus/{compteRendu}/noter', [CompteRenduController::class, 'noter']); // Noter Étudiant
    });

    // =====================  ETUDIANT  =====================
    Route::middleware('role:etudiant')->group(function () {
        Route::post('/tps/{tp}/comptes-rendus', [CompteRenduController::class, 'store']); // Déposer compte rendu
        Route::get('/mes-notes', [CompteRenduController::class, 'mesNotes']);              // Consulter notes
    });

    // =====================  TECHNICIEN  =====================
    Route::middleware('role:technicien')->group(function () {
        Route::post('/materiels', [MaterielController::class, 'store']);       // Mettre à jour les ressources techniques
        Route::put('/materiels/{materiel}', [MaterielController::class, 'update']);
        Route::delete('/materiels/{materiel}', [MaterielController::class, 'destroy']);

        Route::put('/incidents/{incident}', [IncidentController::class, 'update']); // Traiter les incidents
    });

    // =====================  RESPONSABLE  =====================
    Route::middleware('role:responsable')->group(function () {
        Route::get('/utilisateurs', [ResponsableController::class, 'utilisateurs']);       // Gérer les utilisateurs
        Route::post('/utilisateurs', [ResponsableController::class, 'creerUtilisateur']);  // Créer un compte (email hors université autorisé)
        Route::post('/utilisateurs/{user}/valider', [ResponsableController::class, 'validerCompte']);   // Valider compte
        Route::post('/utilisateurs/{user}/rejeter', [ResponsableController::class, 'rejeterCompte']);   // Rejeter inscription
        Route::post('/utilisateurs/{user}/suspendre', [ResponsableController::class, 'suspendreCompte']); // Suspendre compte
        Route::delete('/utilisateurs/{user}', [ResponsableController::class, 'supprimerUtilisateur']); // Supprimer utilisateurcompte
        Route::get('/statistiques', [ResponsableController::class, 'statistiques']);       // Consulter statistiques
        Route::get('/rapports', [ResponsableController::class, 'rapports']);
        Route::get('/enseignants', [EnseignantController::class, 'index']);                // Interagir avec les intervenants

        Route::post('/salles', [SalleController::class, 'store']);             // Gérer les salles
        Route::put('/salles/{salle}', [SalleController::class, 'update']);
        Route::delete('/salles/{salle}', [SalleController::class, 'destroy']);

        Route::post('/incidents/{incident}/transmettre', [IncidentController::class, 'transmettre']); // Transmettre au technicien

        Route::post('/materiels-admin', [MaterielController::class, 'store']); // Gérer ressources matérielles
        Route::put('/materiels-admin/{materiel}', [MaterielController::class, 'update']);
        Route::delete('/materiels-admin/{materiel}', [MaterielController::class, 'destroy']);
    });
});
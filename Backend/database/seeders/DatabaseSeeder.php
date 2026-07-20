<?php

namespace Database\Seeders;

use App\Models\Enseignant;
use App\Models\Etudiant;
use App\Models\Materiel;
use App\Models\Responsable;
use App\Models\Salle;
use App\Models\Technicien;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Responsable
        $respUser = User::create([
            'nom' => 'Diop', 'prenom' => 'Awa', 'email' => 'responsable@labtpad.sn',
            'password' => Hash::make('password'), 'role' => 'responsable', 'statut' => 'actif',
        ]);
        Responsable::create(['user_id' => $respUser->id, 'date_nomination' => now()]);

        // Enseignant
        $ensUser = User::create([
            'nom' => 'Ndiaye', 'prenom' => 'Moussa', 'email' => 'enseignant@labtpad.sn',
            'password' => Hash::make('password'), 'role' => 'enseignant', 'statut' => 'actif',
        ]);
        Enseignant::create(['user_id' => $ensUser->id, 'specialite' => 'Réseaux', 'disponibilite' => true]);

        // Etudiant
        $etudUser = User::create([
            'nom' => 'Fall', 'prenom' => 'Ibrahima', 'email' => 'etudiant@labtpad.sn',
            'password' => Hash::make('password'), 'role' => 'etudiant', 'statut' => 'actif',
        ]);
        Etudiant::create(['user_id' => $etudUser->id, 'groupe' => 'L3-GI', 'date_inscription' => now()]);

        // Technicien
        $techUser = User::create([
            'nom' => 'Sarr', 'prenom' => 'Ousmane', 'email' => 'technicien@labtpad.sn',
            'password' => Hash::make('password'), 'role' => 'technicien', 'statut' => 'actif',
        ]);
        Technicien::create(['user_id' => $techUser->id, 'matricule' => 'TECH-001']);

        // Salles & Matériels
        Salle::insert([
            ['nom' => 'Labo Réseaux A', 'capacite' => 20, 'disponibilite' => true, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Labo Systèmes B', 'capacite' => 15, 'disponibilite' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);

        Materiel::insert([
            ['nom' => 'Routeur Cisco 2901', 'type' => 'Réseau', 'disponibilite' => true, 'quantite' => 10, 'etat' => 'bon', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Switch Cisco 2960', 'type' => 'Réseau', 'disponibilite' => true, 'quantite' => 8, 'etat' => 'bon', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}

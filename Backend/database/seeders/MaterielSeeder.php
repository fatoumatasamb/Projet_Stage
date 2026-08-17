<?php

namespace Database\Seeders;

use App\Models\Materiel;
use Illuminate\Database\Seeder;

class MaterielSeeder extends Seeder
{
    public function run(): void
    {
        $materiels = [
            // 1. Matériels scientifiques et didactiques
            ['nom' => 'Alimentation stabilisée', 'type' => 'Alimentation', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Générateur BF', 'type' => 'Générateur', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 6, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Oscilloscope numérique', 'type' => 'Instrument de mesure', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 8, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Multimètre', 'type' => 'Instrument de mesure', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 15, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => "Maquette d'électricité", 'type' => 'Maquette', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 5, 'etat' => 'use', 'disponibilite' => true],
            ['nom' => 'Banc optique', 'type' => 'Banc expérimental', 'categorie' => 'Matériels scientifiques et didactiques', 'quantite' => 3, 'etat' => 'bon', 'disponibilite' => true],

            // 2. Capteurs et instrumentation
            ['nom' => 'Capteur de température DS18B20', 'type' => 'Capteur', 'categorie' => 'Capteurs et instrumentation', 'quantite' => 20, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Capteur de pression', 'type' => 'Capteur', 'categorie' => 'Capteurs et instrumentation', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Capteur de luminosité (LDR)', 'type' => 'Capteur', 'categorie' => 'Capteurs et instrumentation', 'quantite' => 25, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => "Accéléromètre", 'type' => 'Capteur', 'categorie' => 'Capteurs et instrumentation', 'quantite' => 12, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Thermocouple type K', 'type' => 'Capteur', 'categorie' => 'Capteurs et instrumentation', 'quantite' => 15, 'etat' => 'bon', 'disponibilite' => true],

            // 3. Acquisition de données
            ['nom' => 'Carte DAQ USB', 'type' => "Carte d'acquisition", 'categorie' => 'Acquisition de données', 'quantite' => 6, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Interface EXAO', 'type' => "Interface d'acquisition", 'categorie' => 'Acquisition de données', 'quantite' => 4, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Convertisseur ADC/DAC', 'type' => 'Convertisseur', 'categorie' => 'Acquisition de données', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],

            // 4. Commande et contrôle
            ['nom' => 'Arduino Uno', 'type' => 'Microcontrôleur', 'categorie' => 'Commande et contrôle', 'quantite' => 20, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'ESP32', 'type' => 'Microcontrôleur', 'categorie' => 'Commande et contrôle', 'quantite' => 15, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Carte FPGA', 'type' => 'Composant logique programmable', 'categorie' => 'Commande et contrôle', 'quantite' => 5, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Module relais', 'type' => 'Actionneur', 'categorie' => 'Commande et contrôle', 'quantite' => 12, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Driver moteur L298N', 'type' => 'Driver', 'categorie' => 'Commande et contrôle', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],

            // 5. Informatique embarquée et calcul
            ['nom' => 'Raspberry Pi 4', 'type' => 'Nano-ordinateur', 'categorie' => 'Informatique embarquée et calcul', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Mini-PC de laboratoire', 'type' => 'Ordinateur', 'categorie' => 'Informatique embarquée et calcul', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Station de travail', 'type' => 'Ordinateur', 'categorie' => 'Informatique embarquée et calcul', 'quantite' => 5, 'etat' => 'bon', 'disponibilite' => true],

            // 6. Audiovisuel et supervision
            ['nom' => 'Caméra IP', 'type' => 'Caméra', 'categorie' => 'Audiovisuel et supervision', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Webcam USB', 'type' => 'Caméra', 'categorie' => 'Audiovisuel et supervision', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Caméra Raspberry Pi', 'type' => 'Caméra', 'categorie' => 'Audiovisuel et supervision', 'quantite' => 8, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => "Kit d'éclairage LED", 'type' => 'Éclairage', 'categorie' => 'Audiovisuel et supervision', 'quantite' => 6, 'etat' => 'bon', 'disponibilite' => true],

            // 7. Réseau et communication
            ['nom' => 'Routeur Cisco 2901', 'type' => 'Réseau', 'categorie' => 'Réseau et communication', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Switch Cisco 2960', 'type' => 'Réseau', 'categorie' => 'Réseau et communication', 'quantite' => 8, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => "Point d'accès Wi-Fi", 'type' => 'Réseau', 'categorie' => 'Réseau et communication', 'quantite' => 6, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Passerelle IoT', 'type' => 'Réseau', 'categorie' => 'Réseau et communication', 'quantite' => 4, 'etat' => 'bon', 'disponibilite' => true],

            // 8. Infrastructure, alimentation et sécurité
            ['nom' => 'Onduleur', 'type' => 'Alimentation de secours', 'categorie' => 'Infrastructure, alimentation et sécurité', 'quantite' => 5, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => 'Multiprise protégée', 'type' => 'Protection électrique', 'categorie' => 'Infrastructure, alimentation et sécurité', 'quantite' => 15, 'etat' => 'bon', 'disponibilite' => true],
            ['nom' => "Coffret d'arrêt d'urgence", 'type' => 'Sécurité', 'categorie' => 'Infrastructure, alimentation et sécurité', 'quantite' => 10, 'etat' => 'bon', 'disponibilite' => true],
        ];

        foreach ($materiels as $m) {
            Materiel::updateOrCreate(['nom' => $m['nom']], $m);
        }
    }
}
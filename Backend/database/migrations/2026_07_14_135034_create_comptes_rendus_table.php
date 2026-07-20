<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comptes_rendus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('etudiants')->cascadeOnDelete();
            $table->foreignId('tp_id')->constrained('tps')->cascadeOnDelete();
            $table->string('fichier');
            $table->timestamp('date_depot')->useCurrent();
            $table->decimal('note', 4, 2)->nullable();
            $table->enum('statut', ['depose', 'en_attente_validation', 'valide', 'refuse'])->default('depose');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comptes_rendus');
    }
};

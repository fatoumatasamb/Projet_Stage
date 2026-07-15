<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technicien_id')->nullable()->constrained('techniciens')->nullOnDelete();
            $table->foreignId('materiel_id')->nullable()->constrained('materiels')->nullOnDelete();
            $table->foreignId('salle_id')->nullable()->constrained('salles')->nullOnDelete();
            $table->text('description');
            $table->enum('statut', ['signale', 'en_cours', 'resolu'])->default('signale');
            $table->timestamp('date_signalement')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};

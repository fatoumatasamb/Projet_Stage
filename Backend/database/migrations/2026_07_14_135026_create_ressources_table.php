<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ressources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tp_id')->constrained('tps')->cascadeOnDelete();
            $table->string('titre');
            $table->string('fichier')->nullable(); // chemin du fichier stocké
            $table->text('description')->nullable();
            $table->timestamp('date_depot')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ressources');
    }
};

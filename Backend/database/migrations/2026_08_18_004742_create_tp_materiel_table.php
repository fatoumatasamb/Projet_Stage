<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tp_materiel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tp_id')->constrained()->cascadeOnDelete();
            $table->foreignId('materiel_id')->constrained()->cascadeOnDelete();
            $table->integer('quantite')->default(1);
            $table->timestamps();

            $table->unique(['tp_id', 'materiel_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tp_materiel');
    }
};
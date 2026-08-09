<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            if (! Schema::hasColumn('etudiants', 'niveau')) {
                $table->string('niveau')->nullable()->after('groupe');
            }
            if (! Schema::hasColumn('etudiants', 'filiere')) {
                $table->string('filiere')->nullable()->after('niveau');
            }
        });
    }

    public function down(): void
    {
        // Ne rien faire ici : ces colonnes sont gerees par la migration
        // add_departement_filiere_niveau_to_etudiants_table
    }
};
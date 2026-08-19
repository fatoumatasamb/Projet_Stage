<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            if (! Schema::hasColumn('etudiants', 'departement')) {
                $table->string('departement')->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('etudiants', 'filiere')) {
                $table->string('filiere')->nullable()->after('departement');
            }
            if (! Schema::hasColumn('etudiants', 'niveau')) {
                $table->string('niveau')->nullable()->after('filiere');
            }
        });
    }

    public function down(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            $table->dropColumn(['departement', 'filiere', 'niveau']);
        });
    }
};
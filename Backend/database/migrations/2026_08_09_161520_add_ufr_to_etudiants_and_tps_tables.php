<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            if (! Schema::hasColumn('etudiants', 'ufr')) {
                $table->string('ufr')->nullable()->after('user_id');
            }
        });

        Schema::table('tps', function (Blueprint $table) {
            if (! Schema::hasColumn('tps', 'ufr')) {
                $table->string('ufr')->nullable()->after('departement');
            }
        });
    }

    public function down(): void
    {
        Schema::table('etudiants', function (Blueprint $table) {
            $table->dropColumn('ufr');
        });
        Schema::table('tps', function (Blueprint $table) {
            $table->dropColumn('ufr');
        });
    }
};
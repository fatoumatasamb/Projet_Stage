<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incidents', function ($table) {
            $table->foreignId('signale_par_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });

        DB::statement("ALTER TABLE incidents MODIFY statut ENUM('signale','transmis','en_cours','resolu') DEFAULT 'signale'");
    }

    public function down(): void
    {
        Schema::table('incidents', function ($table) {
            $table->dropConstrainedForeignId('signale_par_id');
        });

        DB::statement("ALTER TABLE incidents MODIFY statut ENUM('signale','en_cours','resolu') DEFAULT 'signale'");
    }
};
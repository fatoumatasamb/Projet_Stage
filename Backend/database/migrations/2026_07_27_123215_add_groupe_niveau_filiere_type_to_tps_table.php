<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tps', function (Blueprint $table) {
            $table->string('groupe')->nullable()->after('description');
            $table->string('niveau')->nullable()->after('groupe');
            $table->string('filiere')->nullable()->after('niveau');
        });
    }

    public function down(): void
    {
        Schema::table('tps', function (Blueprint $table) {
            $table->dropColumn(['groupe', 'niveau', 'filiere']);
        });
    }
};
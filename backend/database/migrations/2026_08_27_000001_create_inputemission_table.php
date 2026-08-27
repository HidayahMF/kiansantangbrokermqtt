<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The `inputemission` table stores raw sensor readings ingested by the
     * Python service (`python/toSQL.py`) via the `GET /insert` endpoint.
     */
    public function up(): void
    {
        Schema::create('inputemission', function (Blueprint $table) {
            $table->id();
            $table->dateTime('timestamp')->useCurrent()->index();
            $table->decimal('voltage', 12, 3)->nullable();
            $table->decimal('current', 12, 3)->nullable();
            $table->decimal('power', 12, 3)->nullable();
            $table->decimal('energy', 12, 3)->nullable();
            $table->decimal('frequency', 12, 3)->nullable();
            $table->decimal('powerFactor', 12, 3)->nullable();
            $table->decimal('tempAmbient', 12, 3)->nullable();
            $table->decimal('tempObject', 12, 3)->nullable();
            $table->decimal('CO2', 12, 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inputemission');
    }
};
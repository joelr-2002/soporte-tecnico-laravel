<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('slas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent']);
            $table->integer('response_time')->unsigned()->comment('Response time in minutes');
            $table->integer('resolution_time')->unsigned()->comment('Resolution time in minutes');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['priority', 'is_active']);
            $table->index('priority');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slas');
    }
};

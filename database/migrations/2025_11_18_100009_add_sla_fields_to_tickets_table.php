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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('sla_id')->nullable()->after('category_id')->constrained('slas')->onDelete('set null');
            $table->timestamp('first_response_at')->nullable()->after('status');
            $table->timestamp('sla_response_due_at')->nullable()->after('first_response_at');
            $table->timestamp('sla_resolution_due_at')->nullable()->after('sla_response_due_at');
            $table->boolean('sla_response_breached')->default(false)->after('sla_resolution_due_at');
            $table->boolean('sla_resolution_breached')->default(false)->after('sla_response_breached');
            $table->timestamp('resolved_at')->nullable()->after('sla_resolution_breached');

            $table->index('sla_response_due_at');
            $table->index('sla_resolution_due_at');
            $table->index('sla_response_breached');
            $table->index('sla_resolution_breached');
            $table->index('first_response_at');
            $table->index('resolved_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['sla_id']);
            $table->dropColumn([
                'sla_id',
                'first_response_at',
                'sla_response_due_at',
                'sla_resolution_due_at',
                'sla_response_breached',
                'sla_resolution_breached',
                'resolved_at',
            ]);
        });
    }
};

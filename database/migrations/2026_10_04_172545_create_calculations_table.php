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
        Schema::create('calculations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();
            // Inputs
            $table->decimal('product_price', 15, 2);
            $table->decimal('monthly_ad_spend', 15, 2);
            $table->decimal('cpr', 15, 2);
            $table->decimal('average_order_value', 15, 2);
            // Computed outputs
            $table->decimal('results_count', 12, 4);
            $table->decimal('revenue', 15, 2);
            $table->decimal('profit', 15, 2);
            $table->decimal('roi_percentage', 8, 2);
            $table->decimal('cpr_target', 15, 2);
            $table->decimal('margin_per_result', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calculations');
    }
};

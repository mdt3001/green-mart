<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('flash_sales', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->string('name')->nullable(false);
            $table->timestamp('start_time')->nullable(false);
            $table->timestamp('end_time')->nullable(false);
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->index(['start_time', 'end_time'], 'idx_time_range');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flash_sales');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->string('code', 50)->primary();
            $table->string('description')->nullable();
            $table->float('discount')->default(0)->nullable(false);
            $table->boolean('for_new_user')->default(false);
            $table->boolean('for_member')->default(false);
            $table->boolean('is_public')->default(true);
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('expires_at', 'idx_expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};

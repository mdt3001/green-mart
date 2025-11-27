<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->float('total')->default(0)->nullable(false);
            $table->enum('status', ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('ORDER_PLACED');
            $table->uuid('user_id')->nullable();
            $table->uuid('store_id')->nullable();
            $table->uuid('address_id')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->enum('payment_method', ['COD', 'STRIPE'])->nullable();
            $table->boolean('is_coupon_used')->default(false);
            $table->json('coupon')->nullable();
            $table->timestamps();

            $table->index('user_id', 'idx_user_id');
            $table->index('store_id', 'idx_store_id');
            $table->index('address_id', 'idx_address_id');
            $table->index('status', 'idx_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

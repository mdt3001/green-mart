<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('coupon_store', function (Blueprint $table) {
            $table->string('coupon_code', 50);
            $table->uuid('store_id');
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->primary(['coupon_code', 'store_id']);
            $table->foreign('coupon_code')->references('code')->on('coupons')->onDelete('cascade');
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupon_store');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('flash_sale_products', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->uuid('flash_sale_id');
            $table->uuid('product_id');
            $table->uuid('store_id')->nullable();
            $table->float('discount_percent')->default(0)->nullable(false);
            $table->integer('stock_limit')->default(0)->nullable(false);
            $table->timestamps();

            $table->unique(['flash_sale_id', 'product_id'], 'uk_flash_product');
            $table->index('flash_sale_id', 'idx_flash_sale_id');
            $table->index('product_id', 'idx_product_id');
            $table->index('store_id', 'idx_store_id');
        });

        // Thêm CHECK constraint
        DB::statement('ALTER TABLE flash_sale_products ADD CONSTRAINT chk_discount_range CHECK (discount_percent >= 0 AND discount_percent <= 100)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE flash_sale_products DROP CONSTRAINT chk_discount_range');
        Schema::dropIfExists('flash_sale_products');
    }
};

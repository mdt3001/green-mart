<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;  // Import để dùng DB::statement

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->string('name');
            $table->text('description')->nullable();
            $table->float('mrp')->nullable(false);
            $table->float('price')->nullable(false);
            $table->json('images')->nullable();
            $table->string('category')->nullable();
            $table->boolean('in_stock')->default(true);
            $table->uuid('store_id')->nullable();
            $table->timestamps();

            $table->index('store_id', 'idx_store_id');
        });

        // Thêm CHECK constraint bằng raw SQL
        DB::statement('ALTER TABLE products ADD CONSTRAINT chk_price_mrp CHECK (price <= mrp)');
    }

    public function down(): void
    {
        // Drop constraint trước khi drop table
        DB::statement('ALTER TABLE products DROP CONSTRAINT chk_price_mrp');
        Schema::dropIfExists('products');
    }
};

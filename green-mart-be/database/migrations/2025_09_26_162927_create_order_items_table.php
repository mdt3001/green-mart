<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('order_id');
            $table->uuid('product_id');
            $table->integer('quantity')->default(1)->nullable(false);
            $table->float('price')->nullable(false);

            $table->primary(['order_id', 'product_id']);
            $table->index('product_id', 'idx_product_id');
        });

        // Thêm CHECK constraint
        DB::statement('ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE order_items DROP CONSTRAINT chk_quantity_positive');
        Schema::dropIfExists('order_items');
    }
};

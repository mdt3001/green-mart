<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->integer('rating')->nullable(false);
            $table->text('review')->nullable();
            $table->uuid('user_id')->nullable();
            $table->uuid('product_id')->nullable();
            $table->uuid('order_id')->nullable();
            $table->timestamps();

            $table->index('user_id', 'idx_user_id');
            $table->index('product_id', 'idx_product_id');
            $table->index('order_id', 'idx_order_id');
        });

        // Thêm CHECK constraint
        DB::statement("ALTER TABLE ratings ADD CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5)");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE ratings DROP CONSTRAINT chk_rating_range');
        Schema::dropIfExists('ratings');
    }
};

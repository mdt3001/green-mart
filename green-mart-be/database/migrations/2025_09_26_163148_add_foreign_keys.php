<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;  // Để thêm FK thủ công nếu cần

return new class extends Migration {
    public function up(): void
    {
        // products.store_id > stores.id
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('set null')->onUpdate('cascade');
        });

        // orders.user_id > users.id
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // orders.store_id > stores.id
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('set null')->onUpdate('cascade');
        });

        // orders.address_id > addresses.id
        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('address_id')->references('id')->on('addresses')->onDelete('set null')->onUpdate('cascade');
        });

        // order_items.order_id > orders.id
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
        });

        // ratings.user_id > users.id, etc.
        Schema::table('ratings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null')->onUpdate('cascade');
        });

        // addresses.user_id > users.id
        Schema::table('addresses', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // stores.user_id > users.id
        Schema::table('stores', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // wishlists.user_id > users.id, product_id > products.id
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });

        // flash_sale_products...
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->foreign('flash_sale_id')->references('id')->on('flash_sales')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('set null')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        // Drop FK theo thứ tự ngược lại nếu cần
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->dropForeign(['flash_sale_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['store_id']);
        });
        // ... Tương tự cho các bảng khác
    }
};

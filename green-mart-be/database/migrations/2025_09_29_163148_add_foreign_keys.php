<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
        });

        // order_items.product_id > products.id
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict')->onUpdate('cascade');
        });

        // ratings.user_id > users.id
        Schema::table('ratings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // ratings.product_id > products.id
        Schema::table('ratings', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });

        // ratings.order_id > orders.id
        Schema::table('ratings', function (Blueprint $table) {
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

        // wishlists.user_id > users.id
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // wishlists.product_id > products.id
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });

        // flash_sale_products.flash_sale_id > flash_sales.id
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->foreign('flash_sale_id')->references('id')->on('flash_sales')->onDelete('cascade')->onUpdate('cascade');
        });

        // flash_sale_products.product_id > products.id
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade')->onUpdate('cascade');
        });

        // flash_sale_products.store_id > stores.id
        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('set null')->onUpdate('cascade');
        });

        // role_permissions.role_id > roles.id
        Schema::table('role_permissions', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade')->onUpdate('cascade');
        });

        // role_permissions.permission_id > permissions.id
        Schema::table('role_permissions', function (Blueprint $table) {
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade')->onUpdate('cascade');
        });

        // user_roles.user_id > users.id
        Schema::table('user_roles', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        // user_roles.role_id > roles.id
        Schema::table('user_roles', function (Blueprint $table) {
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        // Drop FK theo thứ tự ngược (bắt đầu từ bảng con nhất)
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::table('role_permissions', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['permission_id']);
        });

        Schema::table('flash_sale_products', function (Blueprint $table) {
            $table->dropForeign(['flash_sale_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['store_id']);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['product_id']);
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('ratings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['product_id']);
            $table->dropForeign(['order_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['store_id']);
            $table->dropForeign(['address_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
        });
    }
};

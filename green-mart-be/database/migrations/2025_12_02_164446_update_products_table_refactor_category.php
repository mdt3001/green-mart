<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // 1. Xóa các cột cũ
            $table->dropColumn(['category', 'subcategory']);

            // 2. Thêm cột category_id mới
            // Lưu ý: products dùng UUID, nhưng category dùng ID thường (BigInt) là bình thường.
            // Nếu bạn muốn category cũng dùng UUID thì sửa lại bước 1.
            $table->unsignedBigInteger('category_id')->nullable()->after('name');

            // 3. Tạo khóa ngoại
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Khôi phục lại (nếu rollback)
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');

            $table->string('category')->nullable();
            $table->string('subcategory')->nullable();
        });
    }
};

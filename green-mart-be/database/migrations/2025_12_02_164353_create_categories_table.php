<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Sử dụng BigInteger cho ID danh mục
            $table->string('name');
            $table->string('slug')->unique()->nullable(); // Thêm slug để làm URL thân thiện (tùy chọn)
            $table->unsignedBigInteger('parent_id')->nullable(); // Khóa ngoại tham chiếu chính bảng này
            $table->timestamps();

            // Tạo khóa ngoại tự tham chiếu
            $table->foreign('parent_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null'); // Nếu xóa cha, con sẽ thành root hoặc xử lý tùy ý
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};

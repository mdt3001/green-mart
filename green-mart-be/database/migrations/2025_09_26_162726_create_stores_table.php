<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->uuid('user_id')->unique();
            $table->string('name')->nullable(false);
            $table->text('description')->nullable();
            $table->string('username')->unique()->nullable(false);
            $table->string('address')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('is_active')->default(true);
            $table->string('logo')->nullable();
            $table->string('email')->unique()->nullable(false);
            $table->string('contact')->nullable();
            $table->timestamps();

            $table->index('user_id', 'idx_user_id');
            $table->index('username', 'idx_username');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};

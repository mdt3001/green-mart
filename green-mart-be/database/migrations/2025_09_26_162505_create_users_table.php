<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->string('name');
            $table->string('email')->unique()->nullable(false);
            $table->string('password')->nullable(false);
            $table->enum('status', ['pending', 'active', 'banned', 'deleted'])->default('pending');
            $table->string('phone_number')->nullable();
            $table->string('address')->nullable();
            $table->string('image')->nullable();
            $table->json('cart')->nullable();
            $table->string('activation_token')->nullable();
            $table->string('google_id')->nullable();
            $table->timestamps();  // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

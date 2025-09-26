<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(\Illuminate\Support\Str::uuid());
            $table->uuid('user_id');
            $table->string('name')->nullable(false);
            $table->string('email')->nullable(false);
            $table->string('street')->nullable(false);
            $table->string('city')->nullable(false);
            $table->string('state')->nullable();
            $table->string('zip')->nullable();
            $table->string('country')->default('Vietnam');
            $table->string('phone')->nullable();
            $table->timestamps();

            $table->index('user_id', 'idx_user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

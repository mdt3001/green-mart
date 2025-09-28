<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->uuid('role_id');
            $table->primary(['user_id', 'role_id']);  // Composite PK
            $table->unique(['user_id', 'role_id'], 'uk_user_role');  // Unique để tránh duplicate

            $table->index('user_id', 'idx_user_id');
            $table->index('role_id', 'idx_role_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->uuid('role_id');
            $table->uuid('permission_id');
            $table->primary(['role_id', 'permission_id']);  // Composite PK
            $table->unique(['role_id', 'permission_id'], 'uk_role_permission');  // Unique để tránh duplicate

            $table->index('role_id', 'idx_role_id');
            $table->index('permission_id', 'idx_permission_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_permissions');
    }
};

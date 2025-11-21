<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		Schema::create('users', function (Blueprint $table) {
			$table->uuid('id')->primary();
			$table->string('name');
			$table->string('email')->unique()->nullable(false);
			$table->timestamp('email_verified_at')->nullable();
			$table->string('password')->nullable(false);
			$table->enum('status', ['pending', 'active', 'banned', 'deleted'])->default('pending');
			$table->string('phone_number')->nullable();
			$table->string('address')->nullable();
			$table->string('image')->nullable();
			$table->json('cart')->nullable();
			$table->string('google_id')->nullable();

			// Password reset flow
			$table->string('password_reset_token')->nullable();
			$table->timestamp('password_reset_expires_at')->nullable();

			// Remember token for web guard if needed
			$table->rememberToken();

			$table->timestamps();  // created_at, updated_at
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('users');
	}
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('session_id')->index(); // For guest users
            $table->enum('sender_type', ['user', 'bot'])->default('user');
            $table->text('message');
            $table->text('bot_response')->nullable();
            $table->string('intent')->nullable(); // e.g., greeting, order_status, product_info
            $table->float('confidence')->nullable(); // Confidence score of intent detection
            $table->json('metadata')->nullable(); // Additional data (product_id, order_id, etc.)
            $table->timestamps();
        });

        Schema::create('chat_intents', function (Blueprint $table) {
            $table->id();
            $table->string('intent_name')->unique();
            $table->json('patterns'); // Array of regex patterns or keywords
            $table->json('responses'); // Array of possible responses
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_intents');
    }
};

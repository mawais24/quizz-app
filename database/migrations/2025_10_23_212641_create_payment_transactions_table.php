<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('user_subscription_id')
                ->constrained('user_subscriptions')
                ->cascadeOnDelete();

            $table->decimal('amount', 10, 2)->default(0);
            $table->string('currency', 10)->default('USD');

            $table->string('status', 50)->default('completed'); // or 'pending','failed'
            $table->string('payment_method', 50)->default('stripe');

            $table->string('stripe_payment_intent_id')->nullable();
            $table->json('stripe_response')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'user_subscription_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();

            // Display / business fields
            $table->string('name');
            $table->text('description')->nullable();

            // Billing fields (adapt if you don’t use them)
            $table->decimal('price', 10, 2)->default(0);
            $table->string('currency', 10)->default('USD');
            $table->enum('interval', ['day','week','month','year','lifetime'])->default('month');

            // Duration used by your model: $subscription->subscriptionPlan->days
            $table->unsignedInteger('days'); // e.g. 30 for monthly, 365 for yearly, etc.

            // Optional Stripe metadata if you need it
            $table->string('stripe_price_id')->nullable()->index();

            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};

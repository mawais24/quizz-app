<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            if (!Schema::hasColumn('subscription_plans', 'slug')) {
                $table->string('slug')->unique()->after('name');
            }

            // If you prefer 'duration' instead of 'interval', add it and keep both temporarily
            if (!Schema::hasColumn('subscription_plans', 'duration')) {
                $table->string('duration')->nullable()->after('slug'); // e.g., 'week','month','year','lifetime'
            }

            if (!Schema::hasColumn('subscription_plans', 'features')) {
                $table->json('features')->nullable()->after('description');
            }
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            if (Schema::hasColumn('subscription_plans', 'features')) {
                $table->dropColumn('features');
            }
            if (Schema::hasColumn('subscription_plans', 'duration')) {
                $table->dropColumn('duration');
            }
            if (Schema::hasColumn('subscription_plans', 'slug')) {
                $table->dropUnique(['slug']);
                $table->dropColumn('slug');
            }
        });
    }
};

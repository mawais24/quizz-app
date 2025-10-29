<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->text('description')->nullable();

            // tie to your existing categories table
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();

            // monetization flag
            $table->enum('type', ['free','premium'])->default('free')->index();

            // optional quiz-level settings
            $table->unsignedSmallInteger('time_limit')->nullable();    // minutes (null => no limit)
            $table->unsignedTinyInteger('passing_score')->default(60); // 1..100
            $table->unsignedSmallInteger('max_attempts')->nullable();  // null => unlimited

            $table->boolean('is_active')->default(true)->index();
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('show_correct_answers')->default(true);
            $table->unsignedSmallInteger('points_per_question')->default(1);

            $table->timestamps();

            $table->index(['category_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempt_answers', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('quiz_attempt_id')
                ->constrained('quiz_attempts')
                ->cascadeOnDelete();

            $table->foreignId('question_id')
                ->constrained('questions')
                ->cascadeOnDelete();

            // Data fields
            $table->string('selected_option', 10)->nullable();   // e.g. A, B, C, D
            $table->boolean('is_correct')->nullable();           // whether the chosen answer was right
            $table->integer('points_earned')->default(0);        // points for that question
            $table->integer('time_taken')->nullable();           // seconds user spent on this question

            $table->timestamps();

            // One answer per question per attempt
            $table->unique(['quiz_attempt_id', 'question_id']);

            // Helpful indexes
            $table->index('quiz_attempt_id');
            $table->index('question_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempt_answers');
    }
};

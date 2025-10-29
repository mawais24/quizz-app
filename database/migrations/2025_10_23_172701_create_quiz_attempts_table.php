<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('quiz_id')
                ->constrained('quizzes')
                ->cascadeOnDelete();

            // Either a logged-in user OR a guest session
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('guest_session_id', 100)->nullable()->index();

            // State
            $table->string('status')->default('in_progress')->index(); // in_progress | completed | cancelled

            // Counters & scoring (seen in controller/result usage)
            $table->unsignedInteger('total_questions')->default(0);
            $table->unsignedInteger('answered_questions')->default(0);
            $table->unsignedInteger('correct_answers')->default(0);
            $table->unsignedInteger('wrong_answers')->default(0);

            $table->unsignedInteger('points_earned')->default(0);
            $table->decimal('score', 5, 2)->default(0); // e.g., percentage or computed score
            $table->boolean('passed')->default(false);

            // Timing
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('time_spent_seconds')->nullable();

            $table->timestamps();

            // Helpful compound indexes
            $table->index(['user_id', 'quiz_id']);
            $table->index(['guest_session_id', 'quiz_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};

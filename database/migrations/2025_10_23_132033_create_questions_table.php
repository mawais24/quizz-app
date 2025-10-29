<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->cascadeOnDelete();

            $table->text('question_text');

            // MCQ: 4 options, one correct
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c');
            $table->string('option_d');

            // store the correct option letter
            $table->enum('correct_option', ['A','B','C','D']);

            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('order')->default(0); // optional manual ordering

            $table->timestamps();

            $table->index(['quiz_id','is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};

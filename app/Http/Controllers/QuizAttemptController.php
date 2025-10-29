<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    /**
     * Save an answer during a quiz attempt
     */
    public function saveAnswer(Request $request, Quiz $quiz, QuizAttempt $attempt, Question $question)
    {
        // Check if this attempt belongs to the authenticated user
        if ($attempt->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Validate the request
        $validated = $request->validate([
            'answer' => ['required', 'string', 'in:A,B,C,D'],
        ]);
        
        // Log for debugging
        Log::info('Saving answer', [
            'question_id' => $question->id,
            'submitted_answer' => $validated['answer'],
            'correct_answer' => $question->correct_option,
            'is_correct' => $validated['answer'] === $question->correct_option
        ]);
        
        // Check if an answer already exists
        $answer = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('question_id', $question->id)
            ->first();
            
        $isCorrect = $validated['answer'] === $question->correct_option;
        $pointsEarned = $isCorrect ? $quiz->points_per_question : 0;
        
        if ($answer) {
            // Update existing answer
            $answer->update([
                'selected_option' => $validated['answer'],
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
            ]);
        } else {
            // Create new answer
            QuizAttemptAnswer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'selected_option' => $validated['answer'],
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
            ]);
            
            // Update the attempt's answered_questions count
            $attempt->increment('answered_questions');
        }
        
        // Update attempt stats
        $this->updateAttemptStats($attempt);
        
        // Check if it's an AJAX request
        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned
            ]);
        }
        
        // For Inertia requests, return to the quiz page
        return Inertia::render('Quiz/Take', [
            'quiz' => $quiz,
            'attempt' => $attempt,
            'questions' => $quiz->questions,
            'answers' => $attempt->answers,
            'answerSaved' => true,
            'lastAnswer' => [
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned
            ]
        ]);
    }
    
    /**
     * Submit a completed quiz attempt
     */
    public function submitQuiz(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        // Check if this attempt belongs to the authenticated user
        if ($attempt->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Make sure stats are up to date before completing
        $this->updateAttemptStats($attempt);
        
        // Complete the attempt
        $this->completeAttempt($attempt, $quiz);
        
        // Log final stats
        Log::info('Quiz completed', [
            'attempt_id' => $attempt->id,
            'user_id' => $attempt->user_id,
            'quiz_id' => $quiz->id,
            'score' => $attempt->score,
            'passed' => $attempt->passed,
            'correct_answers' => $attempt->correct_answers,
            'wrong_answers' => $attempt->wrong_answers,
            'total_questions' => $attempt->total_questions
        ]);
        
        // Redirect to results page
        return redirect()->route('quiz.result', [
            'quiz' => $quiz->id,
            'attempt' => $attempt->id,
        ])->with('success', 'Quiz completed successfully!');
    }
    
    /**
     * Update statistics for a quiz attempt
     */
    private function updateAttemptStats(QuizAttempt $attempt)
    {
        // Get all answers for this attempt
        $answers = $attempt->answers()->get();
        
        // Calculate stats
        $correctAnswers = $answers->where('is_correct', true)->count();
        $wrongAnswers = $answers->where('is_correct', false)->count();
        $pointsEarned = $answers->sum('points_earned');
        
        // Update stats
        $attempt->update([
            'correct_answers' => $correctAnswers,
            'wrong_answers' => $wrongAnswers,
            'points_earned' => $pointsEarned,
        ]);
        
        return $attempt;
    }
    
    /**
     * Complete an attempt and calculate final score
     */
    private function completeAttempt(QuizAttempt $attempt, Quiz $quiz)
    {
        // Make sure we have the total questions count
        $totalQuestions = $quiz->questions()->count();
        
        // Get the updated stats
        $attempt = $this->updateAttemptStats($attempt);
        
        // Calculate score as percentage
        $score = 0;
        if ($totalQuestions > 0) {
            $score = ($attempt->correct_answers / $totalQuestions) * 100;
        }
        
        // Determine if passed
        $passed = $score >= $quiz->passing_score;
        
        // Calculate time spent
        $timeSpentSeconds = 0;
        if ($attempt->started_at) {
            $timeSpentSeconds = now()->diffInSeconds($attempt->started_at);
        }
        
        // Complete the attempt
        $attempt->update([
            'status' => 'completed',
            'completed_at' => now(),
            'total_questions' => $totalQuestions,
            'score' => $score,
            'passed' => $passed,
            'time_spent' => $timeSpentSeconds,
            'time_spent_seconds' => $timeSpentSeconds,
        ]);
        
        return $attempt;
    }
}
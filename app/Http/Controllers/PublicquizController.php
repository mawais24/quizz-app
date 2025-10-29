<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PublicQuizController extends Controller
{
    /**
     * Display a listing of public quizzes
     */
    public function index(Request $request)
    {
        $query = Quiz::with('category')
            ->active()
            ->withCount('questions as total_questions');
            
        // Apply filters if provided
        if ($categoryId = $request->input('category')) {
            $query->where('category_id', $categoryId);
        }
        
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }
        
        // Get quizzes
        $quizzes = $query->orderBy('title')->paginate(12)->withQueryString();
        
        // Get categories for filter
        $categories = \App\Models\Category::active()->orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Public/Quizzes/Index', [
            'quizzes' => $quizzes,
            'categories' => $categories,
            'filters' => $request->only(['category', 'type']),
            'auth' => ['user' => $request->user()]
        ]);
    }

    /**
     * Display a specific quiz
     */
    public function show(Request $request, Quiz $quiz)
    {
        // Check if quiz is active
        if (!$quiz->is_active) {
            abort(404);
        }
        
        // If premium quiz, check if user has subscription
        $hasActiveSubscription = false;
        $lastAttempt = null;
        $canStart = true;
        
        // Get current user if authenticated
        $user = $request->user();
        
        if ($user) {
            // Check for subscription if premium quiz
            if ($quiz->type === 'premium') {
                $hasActiveSubscription = $user->hasActiveSubscription();
                $canStart = $hasActiveSubscription;
            }
            
            // Get last attempt
            $lastAttempt = QuizAttempt::where('quiz_id', $quiz->id)
                ->where('user_id', $user->id)
                ->latest()
                ->first();
                
            // Check max attempts if set
            if ($quiz->max_attempts && $lastAttempt) {
                $attemptCount = QuizAttempt::where('quiz_id', $quiz->id)
                    ->where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->count();
                    
                if ($attemptCount >= $quiz->max_attempts) {
                    $canStart = false;
                }
            }
        }
        
        // Load quiz data
        $quiz->load('category');
        
        return Inertia::render('Public/Quizzes/Show', [
            'quiz' => $quiz,
            'hasActiveSubscription' => $hasActiveSubscription,
            'lastAttempt' => $lastAttempt,
            'canStart' => $canStart,
            'auth' => ['user' => $user]
        ]);
    }

    /**
     * Start a new quiz attempt
     */
    public function start(Request $request, Quiz $quiz)
    {
        // Check if quiz is active
        if (!$quiz->is_active) {
            abort(404);
        }
        
        // Get current user or use session ID for guest
        $userId = null;
        $guestSessionId = null;
        
        if ($user = $request->user()) {
            $userId = $user->id;
            
            // Check premium access
            if ($quiz->type === 'premium' && !$user->hasActiveSubscription()) {
                return redirect()->route('subscription.plans')
                    ->with('error', 'This quiz requires a premium subscription.');
            }
            
            // Check max attempts
            if ($quiz->max_attempts) {
                $attemptCount = QuizAttempt::where('quiz_id', $quiz->id)
                    ->where('user_id', $user->id)
                    ->where('status', 'completed')
                    ->count();
                    
                if ($attemptCount >= $quiz->max_attempts) {
                    return redirect()->back()
                        ->with('error', 'You have reached the maximum number of attempts for this quiz.');
                }
            }
        } else {
            // For guest users
            if ($quiz->type === 'premium') {
                return redirect()->route('login')
                    ->with('message', 'Please sign in to access premium quizzes.');
            }
            
            $guestSessionId = session()->getId();
        }
        
        // Create the attempt
        $questions = $quiz->questions;
        
        if ($quiz->shuffle_questions) {
            $questions = $questions->shuffle();
        }
        
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $userId,
            'guest_session_id' => $guestSessionId,
            'status' => 'in_progress',
            'started_at' => now(),
            'total_questions' => $questions->count(),
            'answered_questions' => 0,
            'correct_answers' => 0,
            'wrong_answers' => 0,
        ]);
        
        // Redirect to the quiz taking page
        return redirect()->route('quiz.take', [
            'quiz' => $quiz->id,
            'attempt' => $attempt->id,
        ]);
    }

    /**
     * Take the quiz (show the questions)
     */
    public function take(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        // Check if attempt belongs to current user
        $user = $request->user();
        
        if (($user && $attempt->user_id !== $user->id) || 
            (!$user && $attempt->guest_session_id !== session()->getId())) {
            abort(403, 'Unauthorized attempt access');
        }
        
        // Check if attempt is still in progress
        if ($attempt->status !== 'in_progress') {
            return redirect()->route('quiz.result', [
                'quiz' => $quiz->id,
                'attempt' => $attempt->id,
            ])->with('info', 'This quiz attempt has already been completed.');
        }
        
        // Get questions
        $questions = $quiz->questions()->where('is_active', true)->get();
        
        // Get answers for this attempt
        $answers = $attempt->answers;
        
        // Calculate time remaining if quiz has time limit
        $timeRemaining = null;
        if ($quiz->time_limit) {
            $startTime = $attempt->started_at;
            $endTime = $startTime->addMinutes($quiz->time_limit);
            $timeRemaining = now()->diffInSeconds($endTime);
            
            if ($timeRemaining <= 0) {
                // Time's up - auto-submit
                return $this->complete($request, $quiz, $attempt);
            }
        }
        
        return Inertia::render('Public/Quizzes/Take', [
            'quiz' => $quiz,
            'attempt' => $attempt,
            'questions' => $questions,
            'answers' => $answers,
            'timeRemaining' => $timeRemaining,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Complete the quiz attempt
     */
    public function complete(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        // Check if attempt belongs to current user
        $user = $request->user();
        
        if (($user && $attempt->user_id !== $user->id) || 
            (!$user && $attempt->guest_session_id !== session()->getId())) {
            abort(403, 'Unauthorized attempt access');
        }
        
        // Calculate total questions
        $totalQuestions = $quiz->questions()->where('is_active', true)->count();
        
        // Calculate correct answers
        $correctAnswers = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('is_correct', true)
            ->count();
            
        $wrongAnswers = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('is_correct', false)
            ->count();
            
        // Calculate score
        $score = 0;
        if ($totalQuestions > 0) {
            $score = ($correctAnswers / $totalQuestions) * 100;
        }
        
        // Calculate time spent
        $timeSpentSeconds = 0;
        if ($attempt->started_at) {
            $timeSpentSeconds = now()->diffInSeconds($attempt->started_at);
        }
        
        // Update attempt
        $attempt->update([
            'status' => 'completed',
            'completed_at' => now(),
            'total_questions' => $totalQuestions,
            'answered_questions' => $correctAnswers + $wrongAnswers,
            'correct_answers' => $correctAnswers,
            'wrong_answers' => $wrongAnswers,
            'score' => $score,
            'passed' => $score >= $quiz->passing_score,
            'time_spent' => $timeSpentSeconds / 60, // in minutes
            'time_spent_seconds' => $timeSpentSeconds,
        ]);
        
        // Log the completed attempt
        Log::info('Quiz completed via PublicQuizController', [
            'attempt_id' => $attempt->id,
            'quiz_id' => $quiz->id,
            'user_id' => $user ? $user->id : null,
            'guest_id' => $attempt->guest_session_id,
            'score' => $score,
            'correct' => $correctAnswers,
            'wrong' => $wrongAnswers,
            'total' => $totalQuestions,
            'passed' => $score >= $quiz->passing_score,
        ]);
        
        // Redirect to results
        return redirect()->route('quiz.result', [
            'quiz' => $quiz->id,
            'attempt' => $attempt->id,
        ]);
    }

    /**
     * Submit an answer during a quiz
     */
    public function submitAnswer(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        // Check if attempt belongs to current user
        $user = $request->user();
        
        if (($user && $attempt->user_id !== $user->id) || 
            (!$user && $attempt->guest_session_id !== session()->getId())) {
            return response()->json(['error' => 'Unauthorized attempt access'], 403);
        }
        
        // Validate the request
        $validated = $request->validate([
            'question_id' => ['required', 'exists:questions,id'],
            'answer' => ['required', 'in:A,B,C,D'],
        ]);
        
        // Get the question
        $question = \App\Models\Question::findOrFail($validated['question_id']);
        
        // Check if question belongs to this quiz
        if ($question->quiz_id !== $quiz->id) {
            return response()->json(['error' => 'Invalid question for this quiz'], 400);
        }
        
        // Check if answer already exists
        $answer = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('question_id', $question->id)
            ->first();
            
        $isCorrect = $validated['answer'] === $question->correct_option;
        $pointsEarned = $isCorrect ? $quiz->points_per_question : 0;
        
        Log::info('Answer submission', [
            'question_id' => $question->id, 
            'answer' => $validated['answer'],
            'correct_option' => $question->correct_option,
            'is_correct' => $isCorrect
        ]);
        
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
            
            // Update attempt's answered_questions count
            $attempt->increment('answered_questions');
        }
        
        // Return JSON response for AJAX requests
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'is_correct' => $isCorrect,
                'points_earned' => $pointsEarned,
            ]);
        }
        
        // Redirect back to quiz
        return redirect()->route('quiz.take', [
            'quiz' => $quiz->id,
            'attempt' => $attempt->id,
        ])->with('answer_saved', true);
    }

    /**
     * Display the quiz results
     */
    public function result(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        // Check if attempt belongs to current user
        $user = $request->user();
        
        if (($user && $attempt->user_id !== $user->id) || 
            (!$user && $attempt->guest_session_id !== session()->getId())) {
            abort(403, 'Unauthorized attempt access');
        }
        
        // Check if attempt is completed
        if ($attempt->status !== 'completed') {
            return redirect()->route('quiz.take', [
                'quiz' => $quiz->id,
                'attempt' => $attempt->id,
            ])->with('info', 'Please complete the quiz first.');
        }
        
        // Ensure quiz data is loaded
        $quiz->load('category');
        
        // Load attempt answers
        $answers = $attempt->answers()->with('question')->get();
        
        // Pass answers only if show_correct_answers is enabled
        $answersToPass = $quiz->show_correct_answers ? $answers : null;
        
        return Inertia::render('Public/Quizzes/Result', [
            'quiz' => $quiz,
            'attempt' => $attempt,
            'answers' => $answersToPass,
            'auth' => ['user' => $user],
        ]);
    }
}
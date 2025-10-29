<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\PublicQuizController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserQuizHistoryController;
use App\Http\Controllers\Admin\SubscriptionPlanController;
use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\QuizAttemptFlagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public Quiz Routes (accessible to all)
Route::prefix('quizzes')->name('public.')->group(function () {
    Route::get('/', [PublicQuizController::class, 'index'])->name('quizzes');
    Route::get('/{quiz}', [PublicQuizController::class, 'show'])->name('quiz.show');
});

// Quiz Taking Routes (for both guests and authenticated users)
Route::prefix('quiz')->name('quiz.')->group(function () {
    Route::post('/{quiz}/start', [PublicQuizController::class, 'start'])->name('start');
    Route::get('/{quiz}/attempt/{attempt}', [PublicQuizController::class, 'take'])->name('take');
    
    // Save answer during a quiz attempt - this route is needed for radio button selection
    Route::post('/{quiz}/attempt/{attempt}/question/{question}/answer', [QuizAttemptController::class, 'saveAnswer'])
        ->name('save-answer');
        
    Route::post('/{quiz}/attempt/{attempt}/answer', [PublicQuizController::class, 'submitAnswer'])->name('submit-answer');
    Route::post('/{quiz}/attempt/{attempt}/complete', [PublicQuizController::class, 'complete'])->name('complete');
    
    // Submit the entire quiz
    Route::post('/{quiz}/attempt/{attempt}/submit', [QuizAttemptController::class, 'submitQuiz'])
        ->name('submit');
        
    Route::get('/{quiz}/attempt/{attempt}/result', [PublicQuizController::class, 'result'])->name('result');
});

// Separate flag routes to avoid confusion with the quiz routes prefix
Route::post('/quiz-attempt/{attempt}/question/{questionId}/toggle-flag', [QuizAttemptFlagController::class, 'toggleFlag'])
    ->name('quiz.toggle-flag');

Route::get('/quiz-attempt/{attempt}/flagged-questions', [QuizAttemptFlagController::class, 'getFlagged'])
    ->name('quiz.flagged-questions');

// Subscription Routes
Route::prefix('subscription')->name('subscription.')->group(function () {
    Route::get('/plans', [SubscriptionController::class, 'plans'])->name('plans');
    Route::middleware('auth')->group(function () {
        Route::get('/plan/{plan}/checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
        Route::post('/plan/{plan}/process', [SubscriptionController::class, 'processPayment'])->name('process');
        Route::get('/my-subscription', [SubscriptionController::class, 'mySubscription'])->name('my');
        Route::post('/cancel', [SubscriptionController::class, 'cancel'])->name('cancel');
    });
});

// Authenticated User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    // User Quiz History
    Route::prefix('my')->name('user.')->group(function () {
        Route::get('/quiz-history', [UserQuizHistoryController::class, 'index'])->name('quiz-history');
        Route::get('/quiz-history/{attempt}', [UserQuizHistoryController::class, 'show'])->name('quiz-attempt');
        Route::get('/subscription', [SubscriptionController::class, 'mySubscription'])->name('subscription');
    });
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Categories (for quiz organization)
    Route::resource('categories', CategoryController::class);
    
    // Quizzes (quiz shell: title, category, type, etc.)
    Route::resource('quizzes', QuizController::class);
    
    // Nested MCQ Questions inside each quiz
    Route::prefix('quizzes/{quiz}')->name('quizzes.')->group(function () {
        Route::resource('questions', QuestionController::class)
              ->except(['show'])
              ->names('questions');
    });

    Route::get('quizzes/import/form', [QuizController::class, 'importForm'])->name('quizzes.import.form');
    Route::post('quizzes/import', [QuizController::class, 'import'])->name('quizzes.import');
    Route::get('quizzes/template/download', [QuizController::class, 'downloadTemplate'])->name('quizzes.template');
    
    // Subscription Plans Management
    Route::resource('subscription-plans', SubscriptionPlanController::class);
});

require __DIR__.'/auth.php';
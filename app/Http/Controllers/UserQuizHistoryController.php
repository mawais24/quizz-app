<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserQuizHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $attempts = QuizAttempt::where('user_id', $user->id)
            ->with(['quiz.category'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $stats = [
            'total_attempts' => QuizAttempt::where('user_id', $user->id)->count(),
            'completed' => QuizAttempt::where('user_id', $user->id)->completed()->count(),
            'passed' => QuizAttempt::where('user_id', $user->id)->where('passed', true)->count(),
            'average_score' => QuizAttempt::where('user_id', $user->id)->completed()->avg('score'),
        ];

        return Inertia::render('User/QuizHistory', [
            'attempts' => $attempts,
            'stats' => $stats,
            'filters' => $request->only(['status'])
        ]);
    }

    public function show(QuizAttempt $attempt)
    {
        // Verify ownership
        if ($attempt->user_id !== Auth::id()) {
            abort(403);
        }

        $attempt->load(['quiz', 'answers.question']);

        return Inertia::render('User/QuizAttemptDetail', [
            'attempt' => $attempt
        ]);
    }
}
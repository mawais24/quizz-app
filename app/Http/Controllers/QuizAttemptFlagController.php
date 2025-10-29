<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizAttemptFlagController extends Controller
{
    /**
     * Toggle the flag status for a question in an attempt
     */
    public function toggleFlag(Request $request, QuizAttempt $attempt, $questionId)
    {
        // Check if this attempt belongs to the authenticated user
        if ($attempt->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Find the answer entry
        $answer = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('question_id', $questionId)
            ->first();
        
        if (!$answer) {
            return response()->json(['message' => 'Question not found in this attempt'], 404);
        }
        
        // Toggle the flag
        $answer->update([
            'is_flagged' => !$answer->is_flagged
        ]);
        
        return response()->json([
            'success' => true,
            'is_flagged' => $answer->is_flagged
        ]);
    }
    
    /**
     * Get all flagged questions for the current quiz attempt
     */
    public function getFlagged(QuizAttempt $attempt)
    {
        // Check if this attempt belongs to the authenticated user
        if ($attempt->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Get all flagged questions
        $flaggedAnswers = QuizAttemptAnswer::where('quiz_attempt_id', $attempt->id)
            ->where('is_flagged', true)
            ->with('question')
            ->get();
            
        return response()->json([
            'flagged_questions' => $flaggedAnswers
        ]);
    }
}
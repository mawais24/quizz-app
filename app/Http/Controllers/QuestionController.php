<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    // List questions for a quiz
    public function index(Quiz $quiz)
    {
        return Inertia::render('Questions/Index', [
            'quiz' => $quiz->loadCount('questions'),
            'questions' => $quiz->questions()->get(),
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function create(Quiz $quiz)
    {
        return Inertia::render('Questions/Create', [
            'quiz' => $quiz,
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function store(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'question_text' => ['required','string'],
            'option_a' => ['required','string','max:255'],
            'option_b' => ['required','string','max:255'],
            'option_c' => ['required','string','max:255'],
            'option_d' => ['required','string','max:255'],
            'correct_option' => ['required','in:A,B,C,D'],
            'is_active' => ['boolean'],
            'order' => ['nullable','integer','min:0'],
            'question_image' => ['nullable', 'image', 'max:2048']
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['order'] = $validated['order'] ?? 0;
        $validated['quiz_id'] = $quiz->id;

        // Handle image upload if present
        if ($request->hasFile('question_image')) {
            $path = $request->file('question_image')->store('question_images', 'public');
            $validated['image_path'] = $path;
        }

        Question::create($validated);

        return redirect()->route('admin.quizzes.questions.index', $quiz)->with('success','Question created.');
    }

    public function edit(Quiz $quiz, Question $question)
    {
        return Inertia::render('Questions/Edit', [
            'quiz' => $quiz,
            'question' => $question,
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function update(Request $request, Quiz $quiz, Question $question)
    {
        $validated = $request->validate([
            'question_text' => ['required','string'],
            'option_a' => ['required','string','max:255'],
            'option_b' => ['required','string','max:255'],
            'option_c' => ['required','string','max:255'],
            'option_d' => ['required','string','max:255'],
            'correct_option' => ['required','in:A,B,C,D'],
            'is_active' => ['boolean'],
            'order' => ['nullable','integer','min:0'],
            'question_image' => ['nullable', 'image', 'max:2048'],
            'remove_image' => ['nullable', 'boolean']
        ]);

        $validated['is_active'] = $request->boolean('is_active');
        $validated['order'] = $validated['order'] ?? 0;

        // Handle image upload or removal
        if ($request->hasFile('question_image')) {
            // Remove old image if exists
            if ($question->image_path) {
                Storage::disk('public')->delete($question->image_path);
            }
            
            // Store new image
            $path = $request->file('question_image')->store('question_images', 'public');
            $validated['image_path'] = $path;
        } elseif ($request->boolean('remove_image') && $question->image_path) {
            // Remove image if requested
            Storage::disk('public')->delete($question->image_path);
            $validated['image_path'] = null;
        } else {
            // Keep existing image
            unset($validated['image_path']);
        }

        $question->update($validated);

        return redirect()->route('admin.quizzes.questions.index', $quiz)->with('success','Question updated.');
    }

    public function destroy(Quiz $quiz, Question $question)
    {
        // Remove image if exists
        if ($question->image_path) {
            Storage::disk('public')->delete($question->image_path);
        }
        $question->delete();
        return redirect()->route('admin.quizzes.questions.index', $quiz)->with('success','Question deleted.');
    }
}

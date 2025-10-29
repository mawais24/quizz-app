<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::query()
            ->with('category')
            ->withCount('questions as total_questions');

        if ($s = $request->get('search')) {
            $query->where(function($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('description','like', "%{$s}%");
            });
        }
        if ($cid = $request->get('category_id')) $query->where('category_id', $cid);
        if ($t = $request->get('type')) $query->where('type', $t);
        if ($status = $request->get('status')) {
            $query->where('is_active', $status === 'active');
        }

        return Inertia::render('Quizzes/Index', [
            'quizzes' => $query->orderByDesc('updated_at')->paginate(10)->withQueryString(),
            'categories' => Category::orderBy('name')->get(['id','name']),
            'filters' => $request->only('search','category_id','type','status'),
            'auth' => ['user' => $request->user()],
        ]);
    }

    public function create()
    {
        return Inertia::render('Quizzes/Create', [
            'categories' => Category::orderBy('name')->get(['id','name']),
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'category_id' => ['required','exists:categories,id'],
            'type' => ['required','in:free,premium'],

            'time_limit' => ['nullable','integer','min:0'],
            'passing_score' => ['required','integer','min:1','max:100'],
            'max_attempts' => ['nullable','integer','min:1'],

            'is_active' => ['boolean'],
            'shuffle_questions' => ['boolean'],
            'show_correct_answers' => ['boolean'],
            'points_per_question' => ['required','integer','min:1'],
        ]);

        foreach (['time_limit','max_attempts'] as $k) {
            if ($request->input($k) === '' || $request->input($k) === null) $validated[$k] = null;
        }

        Quiz::create($validated);

        return redirect()->route('admin.quizzes.index')->with('success','Quiz created.');
    }

    public function show(Quiz $quiz)
    {
        $quiz->load('category')
             ->loadCount('questions as total_questions');

        // retrieve questions for this quiz
        $questions = $quiz->questions()->get();

        return Inertia::render('Quizzes/Show', [
            'quiz' => $quiz,
            'questions' => $questions,
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function edit(Quiz $quiz)
    {
        return Inertia::render('Quizzes/Edit', [
            'quiz' => $quiz,
            'categories' => Category::orderBy('name')->get(['id','name']),
            'auth' => ['user' => auth()->user()],
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'category_id' => ['required','exists:categories,id'],
            'type' => ['required','in:free,premium'],
            'time_limit' => ['nullable','integer','min:0'],
            'passing_score' => ['required','integer','min:1','max:100'],
            'max_attempts' => ['nullable','integer','min:1'],
            'is_active' => ['boolean'],
            'shuffle_questions' => ['boolean'],
            'show_correct_answers' => ['boolean'],
            'points_per_question' => ['required','integer','min:1'],
        ]);

        foreach (['time_limit','max_attempts'] as $k) {
            if ($request->input($k) === '' || $request->input($k) === null) $validated[$k] = null;
        }

        $quiz->update($validated);

        return redirect()->route('admin.quizzes.index')->with('success','Quiz updated.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return redirect()->route('admin.quizzes.index')->with('success','Quiz deleted.');
    }
}

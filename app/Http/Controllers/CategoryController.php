<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::with(['parent', 'children'])
            ->orderBy('level')
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create()
    {
        // Get all categories for parent selection
        $categories = Category::where('level', '<', 3) // Can't add children to level 3
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        // Calculate level based on parent
        if ($validated['parent_id']) {
            $parent = Category::find($validated['parent_id']);
            $validated['level'] = $parent->level + 1;
        } else {
            $validated['level'] = 1;
        }

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully!');
    }

    /**
     * Show the form for editing a category
     */
    public function edit(Category $category)
    {
        // Get potential parents (excluding itself and its descendants)
        $categories = Category::where('level', '<', 3)
            ->where('id', '!=', $category->id)
            ->active()
            ->orderBy('name')
            ->get()
            ->reject(function ($cat) use ($category) {
                // Prevent selecting own descendants as parent
                return $this->isDescendant($cat, $category);
            });

        return Inertia::render('Categories/Edit', [
            'category' => $category->load('parent'),
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean'
        ]);

        // Recalculate level if parent changed
        if ($validated['parent_id']) {
            $parent = Category::find($validated['parent_id']);
            $validated['level'] = $parent->level + 1;
        } else {
            $validated['level'] = 1;
        }

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category)
    {
        // Check if category has children
        if ($category->children()->count() > 0) {
            return back()->with('error', 'Cannot delete category with subcategories!');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully!');
    }

    /**
     * Helper: Check if a category is a descendant of another
     */
    private function isDescendant($potential_descendant, $category)
    {
        $parent = $potential_descendant->parent;
        
        while ($parent) {
            if ($parent->id === $category->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        
        return false;
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');
        
        return inertia('Category/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'string|required|max:255',
        ]);

        Category::create(['name' => $request->name]);

        return redirect()->route('category.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'string|required|max:255'
        ]);

        $category->update(['name' => $request->name]);

        return redirect()->route('category.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('category.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}

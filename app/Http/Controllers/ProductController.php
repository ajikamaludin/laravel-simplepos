<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with(['category']);

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');
        
        return inertia('Product/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:1',
            'cost' => 'required|numeric|min:1',
            'stock' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
        ]);

        Product::create([
            'code' => Str::upper(Str::random(6)),
            'name' => $request->name,
            'price' => $request->price,
            'cost' => $request->cost,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('product.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric|min:1',
            'cost' => 'required|numeric|min:1',
            'stock' => 'required|numeric|min:1',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'cost' => $request->cost,
            'stock' => $request->stock,
            'category_id' => $request->category_id,
        ]);

        return redirect()->route('product.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed updated']);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('product.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }
}

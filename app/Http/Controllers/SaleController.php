<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::query()->with(['items.product.category', 'customer']);

        if ($request->q) {
            $query->where('code', 'like', "%{$request->q}%");
        }

        $query->orderBy('created_at', 'desc');
        
        return inertia('Sale/Index', [
            'query' => $query->paginate(10),
        ]);
    }

    public function create(Request $request)
    {
        $products = Product::query()->orderBy('updated_at', 'desc');

        if ($request->q != '') {
            $products->where('name', 'like', "%$request->q%");
        }

        return inertia('Sale/Form', [
            '_products' => $products->paginate(16),
            '_page' => $request->page ?? 1,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.qty' => 'required|numeric'
        ]);

        DB::beginTransaction();
        $sale = Sale::create([
            'code' => Str::upper(Str::random(6)),
            'date' => $request->date, 
            'customer_id' => $request->customer_id,
            'total' => collect($request->items)->sum(fn ($item) => $item['qty'] * $item['price'])
        ]);

        foreach($request->items as $item) {
            $sale->items()->create([
                "product_id" => $item['id'],
                "price" => $item['price'],
                "cost" => $item['cost'],
                "quantity" => $item['qty'],
            ]);
        }
        DB::commit();

        return redirect()->route('sale.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }
}

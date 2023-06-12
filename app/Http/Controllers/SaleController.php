<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

        $startDate = now()->startOfMonth()->format('m/d/Y');
        $endDate = now()->endOfMonth()->format('m/d/Y');

        if ($request->startDate != '' && $request->endDate != '') {
            $startDate = Carbon::parse($request->startDate)->format('m/d/Y');
            $endDate = Carbon::parse($request->endDate)->format('m/d/Y');
        }

        $query->whereBetween('date', [$startDate, $endDate]);

        if ($request->customer_id != '') {
            $query->where('customer_id', $request->customer_id);
        }

        $query->orderBy('date', 'desc');

        return inertia('Sale/Index', [
            'query' => $query->paginate(10),
            '_startDate' => $startDate,
            '_endDate' => $endDate
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
            'items.*.qty' => 'required|numeric',
            'note' => 'nullable|string'
        ]);

        DB::beginTransaction();

        $date = Carbon::parse($request->date);
        $code = 'INV' . $date->format('dmY') . '-' . Sale::where('date', $date->format('m/d/Y'))->count() + 1;

        $sale = Sale::create([
            'code' => $code,
            'date' => $request->date,
            'customer_id' => $request->customer_id,
            'total' => collect($request->items)->sum(fn ($item) => $item['qty'] * $item['price']),
            'note' => $request->note,
        ]);

        foreach ($request->items as $item) {
            $sale->items()->create([
                "product_id" => $item['id'],
                "price" => $item['price'],
                "cost" => $item['cost'],
                "quantity" => $item['qty'],
            ]);

            $product = Product::where('id', $item['id'])->first();
            $stock = $product->stock - $item['qty'];
            if ($stock < 0) {
                DB::rollBack();

                return redirect()->back()
                    ->with('message', ['type' => 'error', 'message' => 'Stok produk tidak cukup']);
            }
            $product->update(['stock' => $stock]);
        }
        DB::commit();

        return redirect()->route('sale.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed saved']);
    }

    public function show(Sale $sale)
    {
        return inertia('Sale/Show', [
            'sale' => $sale->load(['items.product', 'customer']),
        ]);
    }

    public function destroy(Sale $sale)
    {
        DB::beginTransaction();

        foreach ($sale->items as $item) {
            $item->product->update(['stock' => $item->product->stock + $item->quantity]);
        }
        $sale->items()->delete();
        $sale->delete();

        DB::commit();

        return redirect()->route('sale.index')
            ->with('message', ['type' => 'success', 'message' => 'Item has beed deleted']);
    }

    public function invoice(Sale $sale)
    {
        return view('invoice', [
            'sale' => $sale->load(['customer', 'items.product'])
        ]);
    }
}

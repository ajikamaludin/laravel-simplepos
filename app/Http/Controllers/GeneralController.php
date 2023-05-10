<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        $totalSaleToday = Sale::where('date', now()->format('m/d/Y'))->count();
        $totalItem = SaleItem::whereHas('sale', function ($q) {
            return $q->where('date', now()->format('m/d/Y'));
        })->sum('quantity');
        $totalProduct = Product::count();
        $totalCustomer = Customer::count();

        $startDate = now()->subDays(6)->format('m/d/Y');
        $endDate = now()->format('m/d/Y');
        if ($request->start_date != '') {
            $startDate = Carbon::parse($request->start_date)->format('m/d/Y');
        }
        if ($request->end_date != '') {
            $endDate = Carbon::parse($request->end_date)->format('m/d/Y');
        }

        $charts = Sale::selectRaw('SUM(total) as stotal, date')
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'asc')
            ->groupBy('date')
            ->get();

        // $dounat = SaleItem::selectRaw('product_id, SUM(quantity) as qty')
        //     ->with('product.category')
        //     ->join('products', 'products.id', '=', 'sale_items.product_id')
        //     ->groupBy('sale_items.product_id')
        //     ->get();

        $dounat = SaleItem::selectRaw('product_id, SUM(quantity) as qty')
            ->with('product.category')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.date', [now()->startOfMonth()->format('m/d/Y'), now()->endOfMonth()->format('m/d/Y')])
            ->groupBy('sale_items.product_id')
            ->get();

        $favoriteProducts = SaleItem::selectRaw('product_id, sum(quantity) as qty')
            ->groupBy('product_id')
            ->orderBy('qty', 'desc')
            ->with('product')
            ->get();

        $transactionCustomers = Sale::selectRaw('customer_id, sum(total) as stotal')
            ->where('date', now()->format('m/d/Y'))
            ->groupBy('customer_id')
            ->orderBy('stotal')
            ->with('customer')
            ->get();

        return inertia('Dashboard', [
            'total_sale_today' => $totalSaleToday,
            'total_item_today' => $totalItem,
            'total_product' => $totalProduct,
            'total_customer' => $totalCustomer,
            'sale_days' => $charts,
            'favorite_categories' => $dounat,
            'list_favorite_product' => $favoriteProducts,
            'list_customer' => $transactionCustomers
        ]);
    }

    public function maintance()
    {
        return inertia('Maintance');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        $totalSaleToday = Sale::where('date', now()->format('m/d/Y'))->count();
        $totalSaleMonth = Sale::whereBetween('date', [
            now()->startOfMonth()->format('m/d/Y'),
            now()->endOfMonth()->format('m/d/Y')
        ])->sum('total');

        $totalItem = SaleItem::whereHas('sale', function ($q) {
            return $q->where('date', now()->format('m/d/Y'));
        })->sum('quantity');
        $totalItemPrice = SaleItem::whereHas('sale', function ($q) {
            return $q->where('date', now()->format('m/d/Y'));
        })->sum('price');
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
        $target = (Setting::where('key', 'target')->value('value') ?? 90000) / 30;

        $dounat = SaleItem::selectRaw('product_id, category_id, SUM(quantity) as qty')
            ->with('product.category')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.date', [now()->startOfMonth()->format('m/d/Y'), now()->endOfMonth()->format('m/d/Y')])
            ->groupBy('products.category_id')
            ->get();

        $favoriteProducts = SaleItem::selectRaw('product_id, sum(quantity) as qty')
            ->with('product')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->whereBetween('sales.date', [now()->startOfMonth()->format('m/d/Y'), now()->endOfMonth()->format('m/d/Y')])
            ->orderBy('qty', 'desc')
            ->groupBy('product_id')
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
            'total_item_price_today' => $totalItemPrice,
            'total_customer' => $totalCustomer,
            'sale_days' => $charts,
            'favorite_categories' => $dounat,
            'list_favorite_product' => $favoriteProducts,
            'list_customer' => $transactionCustomers,
            'month' => now()->locale('id')->translatedFormat('F'),
            'total_sale_month' => $totalSaleMonth,
            'targets' => [$target, $target, $target, $target, $target, $target, $target, $target]
        ]);
    }

    public function maintance()
    {
        return inertia('Maintance');
    }
}

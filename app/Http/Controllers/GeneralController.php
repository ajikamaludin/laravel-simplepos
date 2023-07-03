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

        $targets = [];

        $originTarget = (Setting::where('key', 'target')->value('value') ?? 90000);
        $target = $originTarget / 30;

        $c = [];
        $order = 'asc';
        if ($request->order != '') {
            $order = $request->order;
        }
        $charts = Sale::selectRaw('SUM(total) as stotal, date')
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', $order)
            ->groupBy('date')
            ->get();

        $date = Carbon::parse($startDate);
        while ($date <= Carbon::parse($endDate)) {
            $total = $charts->where('date', $date->format('m/d/Y'))->value('stotal') ?? 0;
            $c[] = ['stotal' => $total, 'date' => $date->format('m/d/Y')];
            $date = $date->addDay();

            $targets[] = $target;
        }

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
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->whereBetween('sales.date', [now()->startOfMonth()->format('m/d/Y'), now()->endOfMonth()->format('m/d/Y')])
            ->orderBy('qty', $order)
            ->groupBy('product_id');

        if ($request->p_q != '') {
            $favoriteProducts->where(function ($query) use ($request) {
                $query->where('products.name', 'like', "%$request->p_q%")
                    ->orWhere('products.code', 'like', "%$request->p_q%");
            });
        }

        $favoriteProducts = $favoriteProducts->get();

        $transactionCustomers = Sale::selectRaw('customer_id, sum(total) as stotal')
            ->join('customers', 'customers.id', '=', 'sales.customer_id')
            ->where('date', now()->format('m/d/Y'))
            ->groupBy('customer_id')
            ->orderBy('stotal', $order)
            ->with('customer');

        if ($request->c_q != '') {
            $transactionCustomers->where(function ($query) use ($request) {
                $query->where('customers.name', 'like', "%$request->c_q%");
            });
        }

        $transactionCustomers = $transactionCustomers->get();

        return inertia('Dashboard', [
            'total_sale_today' => $totalSaleToday,
            'total_item_today' => $totalItem,
            'total_item_price_today' => $totalItemPrice,
            'total_customer' => $totalCustomer,
            'sale_days' => $c,
            '_startDate' => $startDate,
            '_endDate' => $endDate,
            '_order' => $order,
            '_c_q' => $request->c_q,
            '_p_q' => $request->p_q,
            'favorite_categories' => $dounat,
            'list_favorite_product' => $favoriteProducts,
            'list_customer' => $transactionCustomers,
            'month' => now()->locale('id')->translatedFormat('F'),
            'total_sale_month' => $totalSaleMonth,
            'targets' => $targets,
            'target' => $originTarget,
        ]);
    }

    public function maintance()
    {
        return inertia('Maintance');
    }
}

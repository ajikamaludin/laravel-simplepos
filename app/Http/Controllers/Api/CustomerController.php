<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->q) {
            $query->where('name', 'like', "%{$request->q}%");
        }

        if ($request->except_id) {
            $query->where('id', '!=', $request->except_id);
        }

        if ($request->all == 1) {
            return $query->get();
        }

        return $query->get();
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

        if ($request->except_id) {
            $query->where('id', '!=', $request->except_id);
        }

        if ($request->all == 1) {
            return $query->get();
        }

        return $query->get();
    }
}

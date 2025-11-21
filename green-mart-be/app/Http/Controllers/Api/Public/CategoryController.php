<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Danh sách categories
     */
    public function index()
    {
        $categories = Product::select('category', DB::raw('count(*) as total'))
            ->where('in_stock', true)
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Sản phẩm theo category
     */
    public function products(Request $request, string $category)
    {
        $products = Product::where('category', $category)
            ->where('in_stock', true)
            ->with('store:id,name,logo')
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Danh sách categories với subcategories
     */
    public function index()
    {
        // Lấy categories
        $categories = Product::select('category', DB::raw('count(*) as total'))
            ->where('in_stock', true)
            ->whereNotNull('category')
            ->groupBy('category')
            ->orderBy('total', 'desc')
            ->get();

        // Lấy subcategories theo từng category
        $result = $categories->map(function ($cat) {
            $subcategories = Product::select('subcategory', DB::raw('count(*) as total'))
                ->where('category', $cat->category)
                ->where('in_stock', true)
                ->whereNotNull('subcategory')
                ->groupBy('subcategory')
                ->orderBy('total', 'desc')
                ->get();

            return [
                'category' => $cat->category,
                'total' => $cat->total,
                'subcategories' => $subcategories,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Lấy subcategories của 1 category
     */
    public function subcategories(string $category)
    {
        $subcategories = Product::select('subcategory', DB::raw('count(*) as total'))
            ->where('category', $category)
            ->where('in_stock', true)
            ->whereNotNull('subcategory')
            ->groupBy('subcategory')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subcategories,
        ]);
    }

    /**
     * Sản phẩm theo category và subcategory
     */
    public function products(Request $request, string $category)
    {
        $products = Product::where('category', $category)
            ->where('in_stock', true)
            ->when(
                $request->filled('subcategory'),
                fn($query) =>
                $query->where('subcategory', $request->input('subcategory'))
            )
            ->with('store:id,name,logo')
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}

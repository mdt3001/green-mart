<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Tìm kiếm toàn bộ
     */
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập từ khóa tìm kiếm',
            ], 400);
        }

        $search = '%' . $query . '%';

        // Tìm sản phẩm
        $products = Product::where('in_stock', true)
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('description', 'like', $search)
                    ->orWhereHas('category', function ($q2) use ($search) {
                        $q2->where('name', 'like', $search);
                    });
            })
            ->with(['store:id,name,logo', 'category'])
            ->limit(10)
            ->get();

        // Tìm stores
        $stores = Store::where('is_active', true)
            ->where('status', 'approved')
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('description', 'like', $search)
                    ->orWhere('username', 'like', $search);
            })
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products,
                'stores' => $stores,
            ],
        ]);
    }

    /**
     * Gợi ý tìm kiếm
     */
    public function suggestions(Request $request)
    {
        $query = $request->input('q');

        if (!$query || strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $search = '%' . $query . '%';

        // Lấy tên sản phẩm gợi ý
        $productNames = Product::where('in_stock', true)
            ->where('name', 'like', $search)
            ->distinct()
            ->limit(5)
            ->pluck('name');

        // Lấy categories gợi ý (cả cha và con)
        $categories = \App\Models\Category::where('name', 'like', $search)
            ->distinct()
            ->limit(5)
            ->pluck('name');

        // Lấy store names gợi ý
        $storeNames = Store::where('is_active', true)
            ->where('status', 'approved')
            ->where('name', 'like', $search)
            ->distinct()
            ->limit(3)
            ->pluck('name');

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $productNames,
                'categories' => $categories,
                'stores' => $storeNames,
            ],
        ]);
    }
}

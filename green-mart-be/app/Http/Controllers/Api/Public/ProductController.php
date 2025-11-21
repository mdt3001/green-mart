<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Danh sách sản phẩm công khai
     */
    public function index(Request $request)
    {
        $products = Product::with('store:id,name,logo')
            ->where('in_stock', true)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search)
                        ->orWhere('subcategory', 'like', $search);  // Thêm mới
                });
            })
            ->when(
                $request->filled('category'),
                fn($query) =>
                $query->where('category', $request->input('category'))
            )
            ->when(
                $request->filled('subcategory'),
                fn($query) =>   // Thêm mới
                $query->where('subcategory', $request->input('subcategory'))
            )
            ->when(
                $request->filled('min_price'),
                fn($query) =>
                $query->where('price', '>=', $request->input('min_price'))
            )
            ->when(
                $request->filled('max_price'),
                fn($query) =>
                $query->where('price', '<=', $request->input('max_price'))
            )
            ->when(
                $request->filled('store_id'),
                fn($query) =>
                $query->where('store_id', $request->input('store_id'))
            )
            ->orderBy(
                $request->input('sort_by', 'created_at'),
                $request->input('sort_order', 'desc')
            )
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Chi tiết sản phẩm
     */
    public function show(string $id)
    {
        $product = Product::with([
            'store:id,name,logo,username,description',
            'ratings.user:id,name,image'
        ])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Sản phẩm liên quan
     */
    public function related(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        $relatedProducts = Product::where('category', $product->category)
            ->where('id', '!=', $id)
            ->where('in_stock', true)
            ->with('store:id,name,logo')
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $relatedProducts,
        ]);
    }
}

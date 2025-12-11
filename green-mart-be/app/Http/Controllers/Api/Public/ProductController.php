<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Danh sách sản phẩm công khai
     */
    public function index(Request $request)
    {
        $products = Product::with(['store:id,name,logo', 'category'])
            ->where('in_stock', true)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search)
                        ->orWhereHas('category', function ($q2) use ($search) {
                            $q2->where('name', 'like', $search);
                        });
                });
            })
            // Lọc theo category cha
            ->when(
                $request->filled('parent_category_id'),
                function ($query) use ($request) {
                    $parentId = $request->input('parent_category_id');
                    $parent = Category::find($parentId);

                    if ($parent) {
                        $categoryIds = $parent->children()->pluck('id')->push($parent->id);
                        $query->whereIn('category_id', $categoryIds);
                    }
                }
            )
            ->when(
                $request->filled('category_id'),
                fn($query) =>
                $query->where('category_id', $request->input('category_id'))
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
            // ✅ THÊM FILTER RATING (sửa lỗi SQL)
            ->when(
                $request->filled('ratings'),
                function ($query) use ($request) {
                    $ratings = $request->input('ratings'); // array [5, 4, 3]
                    if (is_array($ratings) && count($ratings) > 0) {
                        $query->whereIn('id', function ($subQuery) use ($ratings) {
                            $subQuery->select('product_id')
                                ->from('ratings')
                                ->groupBy('product_id')
                                ->havingRaw('AVG(rating) >= ?', [min($ratings)]);
                        });
                    }
                }
            )
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->orderBy(
                $request->input('sort_by', 'created_at'),
                $request->input('sort_order', 'desc')
            )
            ->paginate($request->integer('per_page', 12));

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

    public function latest(Request $request)
    {
        $limit = $request->input('limit', 10);

        $products = Product::with('store:id,name,logo')
            ->where('in_stock', true)
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function bestSelling(Request $request)
    {
        $limit = $request->input('limit', 10);

        $products = Product::with('store:id,name,logo')
            ->where('in_stock', true)
            ->withSum('orderItems', 'quantity')
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->orderByDesc('order_items_sum_quantity')
            ->orderByDesc('created_at')
            ->take($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}

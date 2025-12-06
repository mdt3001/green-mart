<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Lấy danh sách Categories theo dạng cây (Tree)
     * Dùng để hiển thị Menu hoặc Sidebar
     */
    public function index()
    {
        // Lấy các category cha (parent_id = null) và kèm theo các con (children)
        // Select các cột cần thiết để tối ưu response
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->select('id', 'name', 'slug', 'parent_id');
            }])
            ->select('id', 'name', 'slug', 'parent_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Lấy sản phẩm thuộc Category (bao gồm cả sản phẩm của category con)
     * Ví dụ: Chọn "Trái cây tươi" (Cha) thì phải hiện cả "Táo", "Cam" (Con)
     */
    public function products(Request $request, $id)
    {
        // 1. Tìm Category theo ID
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        // 2. Lấy danh sách ID của chính nó và các con của nó
        // Để khi query Product thì lấy được hết
        $categoryIds = $category->children()->pluck('id')->push($category->id);

        // 3. Query Product
        $products = Product::whereIn('category_id', $categoryIds)
            ->where('in_stock', true)
            ->with('store:id,name,logo') // Eager load thông tin cửa hàng
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug
            ],
            'data' => $products,
        ]);
    }
}

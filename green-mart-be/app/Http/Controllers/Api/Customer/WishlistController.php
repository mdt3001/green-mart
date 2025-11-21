<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WishlistController extends Controller
{
    /**
     * Danh sách wishlist
     */
    public function index(Request $request)
    {
        $wishlists = Wishlist::where('user_id', $request->user()->id)
            ->with('product:id,name,price,mrp,images,category,in_stock,store_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $wishlists,
        ]);
    }

    /**
     * Thêm vào wishlist
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|uuid|exists:products,id',
        ]);

        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không tồn tại',
            ], 404);
        }

        // Kiểm tra đã tồn tại chưa
        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm đã có trong wishlist',
            ], 400);
        }

        $wishlist = Wishlist::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm vào wishlist thành công',
            'data' => $wishlist->load('product'),
        ], 201);
    }

    /**
     * Xóa khỏi wishlist
     */
    public function destroy(Request $request, string $id)
    {
        $wishlist = Wishlist::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy trong wishlist',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa khỏi wishlist thành công',
        ]);
    }
}

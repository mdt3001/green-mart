<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Lấy giỏ hàng
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cart = $user->cart ?? [];

        // Lấy thông tin chi tiết sản phẩm
        $productIds = array_column($cart, 'product_id');
        $products = Product::whereIn('id', $productIds)
            ->with('store:id,name,logo')
            ->get()
            ->keyBy('id');

        $cartItems = [];
        $total = 0;

        foreach ($cart as $item) {
            if (isset($products[$item['product_id']])) {
                $product = $products[$item['product_id']];
                $itemTotal = $product->price * $item['quantity'];
                $total += $itemTotal;

                $cartItems[] = [
                    'product_id' => $product->id,
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'item_total' => $itemTotal,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $cartItems,
                'total' => $total,
                'items_count' => count($cartItems),
            ],
        ]);
    }

    /**
     * Thêm vào giỏ hàng
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $product = Product::where('id', $request->product_id)
            ->where('in_stock', true)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không khả dụng',
            ], 400);
        }

        $user = $request->user();
        $cart = $user->cart ?? [];

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        $found = false;
        foreach ($cart as &$item) {
            if ($item['product_id'] === $request->product_id) {
                $item['quantity'] += $request->quantity;
                $found = true;
                break;
            }
        }

        if (!$found) {
            $cart[] = [
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ];
        }

        $user->update(['cart' => $cart]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm vào giỏ hàng thành công',
        ]);
    }

    /**
     * Cập nhật số lượng
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $cart = $user->cart ?? [];

        $found = false;
        foreach ($cart as &$item) {
            if ($item['product_id'] === $request->product_id) {
                $item['quantity'] = $request->quantity;
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json([
                'success' => false,
                'message' => 'Sản phẩm không có trong giỏ hàng',
            ], 404);
        }

        $user->update(['cart' => $cart]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật giỏ hàng thành công',
        ]);
    }

    /**
     * Xóa sản phẩm khỏi giỏ
     */
    public function remove(Request $request, string $productId)
    {
        $user = $request->user();
        $cart = $user->cart ?? [];

        $cart = array_filter($cart, function ($item) use ($productId) {
            return $item['product_id'] !== $productId;
        });

        $user->update(['cart' => array_values($cart)]);

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công',
        ]);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clear(Request $request)
    {
        $request->user()->update(['cart' => []]);

        return response()->json([
            'success' => true,
            'message' => 'Xóa giỏ hàng thành công',
        ]);
    }
}

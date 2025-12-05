<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Address;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Danh sách đơn hàng
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['store:id,name,logo', 'address', 'orderItems.product:id,name,images'])
            ->when(
                $request->filled('status'),
                fn($query) =>
                $query->where('status', $request->input('status'))
            )
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Tạo đơn hàng
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'store_id' => 'required|uuid|exists:stores,id',
            'address_id' => 'required|uuid|exists:addresses,id',
            'payment_method' => 'required|in:COD,STRIPE',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Kiểm tra địa chỉ thuộc user
        $address = Address::where('id', $request->address_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Địa chỉ không hợp lệ',
            ], 400);
        }

        try {
            DB::beginTransaction();

            $total = 0;
            $orderItems = [];

            // Tính tổng tiền và validate sản phẩm
            foreach ($request->items as $item) {
                $product = Product::where('id', $item['product_id'])
                    ->where('store_id', $request->store_id)
                    ->where('in_stock', true)
                    ->first();

                if (!$product) {
                    throw new \Exception("Sản phẩm {$item['product_id']} không khả dụng");
                }

                $itemTotal = $product->price * $item['quantity'];
                $total += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            // Xử lý coupon (nếu có)
            $couponData = null;
            $discountAmount = 0;
            $finalTotal = $total;
            
            if ($request->filled('coupon_code')) {
                $code = strtoupper($request->coupon_code);
                $coupon = Coupon::where('code', $code)->where('is_active', true)->first();

                if (!$coupon || $coupon->isExpired()) {
                    throw new \Exception('Mã giảm giá không hợp lệ hoặc đã hết hạn');
                }

                // Kiểm tra coupon có áp dụng cho store này không
                $isEnabled = $coupon->stores()->where('stores.id', $request->store_id)->wherePivot('is_enabled', true)->exists();
                if (!$isEnabled && !$coupon->is_public) {
                    throw new \Exception('Mã không khả dụng cho cửa hàng này');
                }

                // Kiểm tra điều kiện user
                $user = $request->user();
                if ($coupon->for_new_user && $user->orders()->exists()) {
                    throw new \Exception('Chỉ dành cho người dùng mới');
                }

                if ($coupon->for_member && !$user->is_member) {
                    throw new \Exception('Chỉ dành cho thành viên');
                }

                // Tính discount
                $discountAmount = ($total * $coupon->discount) / 100;
                $finalTotal = max(0, $total - $discountAmount);

                $couponData = [
                    'code' => $coupon->code,
                    'description' => $coupon->description,
                    'discount' => $coupon->discount,
                    'discount_amount' => $discountAmount,
                ];
            }

            // Tạo đơn hàng
            $order = Order::create([
                'id' => Str::uuid(),
                'user_id' => $request->user()->id,
                'store_id' => $request->store_id,
                'address_id' => $request->address_id,
                'total' => $finalTotal,
                'status' => 'ORDER_PLACED',
                'payment_method' => $request->payment_method,
                'is_paid' => false,
                'is_coupon_used' => !is_null($couponData),
                'coupon' => $couponData,
                'coupon_code' => $couponData ? $couponData['code'] : null,
            ]);

            // Tạo order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công',
                'data' => $order->load(['orderItems.product', 'address', 'store']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Chi tiết đơn hàng
     */
    public function show(Request $request, string $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->with([
                'store:id,name,logo,email,contact',
                'address',
                'orderItems.product:id,name,price,images'
            ])
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Hủy đơn hàng
     */
    public function cancel(Request $request, string $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        // Chỉ cho phép hủy nếu đơn chưa xử lý
        if (!in_array($order->status, ['ORDER_PLACED', 'PROCESSING'])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng ở trạng thái này',
            ], 400);
        }

        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hủy đơn hàng thành công',
        ]);
    }
}

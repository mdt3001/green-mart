<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Danh sách đơn hàng
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;

        $orders = Order::where('store_id', $store->id)
            ->with(['user:id,name,email', 'address', 'orderItems.product:id,name,price,images'])
            ->when(
                $request->filled('status'),
                fn($query) =>
                $query->where('status', $request->input('status'))
            )
            ->when(
                $request->filled('is_paid'),
                fn($query) =>
                $query->where('is_paid', $request->boolean('is_paid'))
            )
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                        ->orWhere('email', 'like', $search);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Chi tiết đơn hàng
     */
    public function show(Request $request, string $id)
    {
        $store = $request->user()->store;

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->with([
                'user:id,name,email,phone_number',
                'address',
                'orderItems.product:id,name,price,images',
                'ratings'
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
     * Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, string $id)
    {
        $store = $request->user()->store;

        $order = Order::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:ORDER_PLACED,PROCESSING,SHIPPED,DELIVERED',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Kiểm tra logic chuyển trạng thái
        $currentStatus = $order->status;
        $newStatus = $request->input('status');

        $validTransitions = [
            'ORDER_PLACED' => ['PROCESSING'],
            'PROCESSING' => ['SHIPPED'],
            'SHIPPED' => ['DELIVERED'],
            'DELIVERED' => [],
        ];

        if (!in_array($newStatus, $validTransitions[$currentStatus])) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể chuyển sang trạng thái này',
            ], 400);
        }

        $order->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thành công',
            'data' => $order->fresh(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request->user());

        $orders = Order::with(['user:id,name,email', 'store:id,name', 'address', 'orderItems'])
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), function($q) use ($request) {
                $search = '%' . $request->search . '%';
                $q->where('id', 'like', $search)
                  ->orWhereHas('user', fn($sub) => $sub->where('name', 'like', $search));
            })
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        $this->ensureAdmin($request->user());

        $order->load(['user', 'store', 'address', 'orderItems.product', 'ratings']);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $this->ensureAdmin($request->user());

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:ORDER_PLACED,PROCESSING,SHIPPED,DELIVERED',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $order->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật đơn hàng thành công',
            'data' => $order->fresh(),
        ]);
    }

    private function ensureAdmin($user): void
    {
        if (!$user || !$user->roles()->where('name', 'admin')->exists()) {
            abort(Response::HTTP_FORBIDDEN, 'Bạn không có quyền thực hiện thao tác này.');
        }
    }
}
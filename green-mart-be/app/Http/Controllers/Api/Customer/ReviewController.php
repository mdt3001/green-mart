<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Tạo đánh giá
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|uuid|exists:orders,id',
            'product_id' => 'required|uuid|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Kiểm tra đơn hàng thuộc user và đã hoàn thành
        $order = Order::where('id', $request->order_id)
            ->where('user_id', $request->user()->id)
            ->where('status', 'DELIVERED')
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Đơn hàng không hợp lệ hoặc chưa hoàn thành',
            ], 400);
        }

        // Kiểm tra đã đánh giá chưa
        $exists = Rating::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->where('order_id', $request->order_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã đánh giá sản phẩm này rồi',
            ], 400);
        }

        $rating = Rating::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đánh giá thành công',
            'data' => $rating->load('user:id,name,image'),
        ], 201);
    }

    /**
     * Danh sách đánh giá của user
     */
    public function index(Request $request)
    {
        $ratings = Rating::where('user_id', $request->user()->id)
            ->with(['product:id,name,images', 'order:id,created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $ratings,
        ]);
    }
}

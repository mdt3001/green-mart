<?php

namespace App\Http\Controllers\Api\Auth\Seller;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SellerActivationController extends Controller
{
    public function activate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::with('store')
            ->where('activation_token', $request->input('token'))
            ->whereHas('roles', fn ($query) => $query->where('name', 'seller'))
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token đã được sử dụng hoặc không tồn tại',
            ], 404);
        }

        if (!$user->store || $user->store->status !== 'approved' || !$user->store->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Cửa hàng chưa được phê duyệt',
            ], 403);
        }

        $user->forceFill([
            'activation_token' => null,
            'email_verified_at' => now(),
            'status' => 'active',
        ])->save();

        $token = $user->createToken('seller_token', ['seller'])->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Tài khoản đã được kích hoạt, bạn có thể đăng nhập ngay.',
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }
}

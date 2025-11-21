<?php
// filepath: app/Http/Controllers/Api/Auth/Seller/SellerActivationController.php

namespace App\Http\Controllers\Api\Auth\Seller;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SellerActivationController extends Controller
{
    /**
     * Kiểm tra trạng thái store của seller
     */
    public function checkStoreStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::with('store')
            ->where('email', $request->email)
            ->whereHas('roles', fn($query) => $query->where('name', 'seller'))
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tài khoản seller'
            ], 404);
        }

        if (!$user->store) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy thông tin cửa hàng'
            ], 404);
        }

        $store = $user->store;

        return response()->json([
            'success' => true,
            'data' => [
                'email_verified' => $user->email_verified_at !== null,
                'store_status' => $store->status, // pending, approved, rejected
                'store_active' => $store->is_active,
                'store_name' => $store->name,
                'reject_reason' => $store->reject_reason,
                'can_login' => $store->status === 'approved' && $store->is_active && $user->email_verified_at,
            ]
        ]);
    }
}

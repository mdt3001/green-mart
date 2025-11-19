<?php

namespace App\Http\Controllers\Api\Auth\Seller;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SellerAuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::with('store', 'roles')
                ->where('email', $request->email)
                ->whereHas('roles', fn ($query) => $query->where('name', 'seller'))
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email hoặc mật khẩu không đúng'
                ], 401);
            }

            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản chưa được kích hoạt'
                ], 403);
            }

            $store = $user->store ?? $user->stores;

            if (!$store || $store->status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cửa hàng của bạn chưa được phê duyệt'
                ], 403);
            }
            if (!$store->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cửa hàng của bạn đã bị vô hiệu hóa'
                ], 403);
            }
            $token = $user->createToken('seller_token', ['seller'])->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'status' => $user->status,
                        'roles' => $user->roles->pluck('name'),
                    ],
                    'store' => [
                        'id' => $store->id,
                        'name' => $store->name,
                        'status' => $store->status,
                        'is_active' => $store->is_active,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                ]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đăng nhập thất bại',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

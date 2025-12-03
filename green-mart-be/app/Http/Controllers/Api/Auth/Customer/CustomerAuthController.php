<?php

namespace App\Http\Controllers\Api\Auth\Customer;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CustomerAuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::with('roles')
                ->where('email', $request->email)
                ->whereHas('roles', fn($query) => $query->where('name', 'customer'))
                ->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản không tồn tại hoặc không có quyền truy cập'
                ], 401);
            }

            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email hoặc mật khẩu không đúng'
                ], 401);
            }

            if ($user->status === 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.'
                ], 403);
            }

            if ($user->status === 'banned') {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản đã bị khóa'
                ], 403);
            }

            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản chưa được kích hoạt'
                ], 403);
            }

            $token = $user->createToken('customer_token', ['customer'])->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'avatar' => $user->avatar,
                        'status' => $user->status,
                        'roles' => $user->roles->pluck('name'),
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer'
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

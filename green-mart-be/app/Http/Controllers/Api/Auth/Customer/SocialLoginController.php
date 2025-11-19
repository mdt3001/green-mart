<?php

namespace App\Http\Controllers\Api\Auth\Customer;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SocialLoginController extends Controller
{
    public function googleLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'google_id' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'avatar' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('google_id', $request->google_id)
            ->orWhere('email', $request->email)
            ->first();

        if (!$user) {
            // Tạo user mới nếu chưa tồn tại
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'google_id' => $request->google_id,
                'image' => $request->avatar,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            // Gán role customer
            $customerRole = Role::where('name', 'customer')->first();
            $user->roles()->attach($customerRole->id);
        } else {
            // Cập nhật thông tin nếu đã tồn tại
            $user->update([
                'google_id' => $request->google_id,
                'image' => $request->avatar,
                'email_verified_at' => now(),
            ]);
        }

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập Google thành công',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'roles' => $user->roles->pluck('name'),
                ],
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }
}

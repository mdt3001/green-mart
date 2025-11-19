<?php

namespace App\Http\Controllers\Api\Auth\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CustomerRegisterController extends  Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Tạo user
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'pending',
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'activation_token' => Str::random(60),
            ]);

            // Gán role customer
            $customerRole = Role::where('name', 'customer')->first();
            $user->roles()->attach($customerRole->id);

            // Gửi email xác thực
            $this->sendActivationEmail($user);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'status' => $user->status,
                    ]
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đăng ký',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ'
            ], 422);
        }

        $user = User::where('activation_token', $request->token)
            ->where('status', 'pending')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã được sử dụng'
            ], 400);
        }

        $user->update([
            'status' => 'active',
            'email_verified_at' => now(),
            'activation_token' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Xác thực email thành công'
        ]);
    }

    private function sendActivationEmail($user)
    {
        $activationUrl = config('app.frontend_url') . '/verify-email?token=' . $user->activation_token;

        Mail::send('emails.activation', [
            'user' => $user,
            'activationUrl' => $activationUrl,
            'appName' => config('app.name'), // Thêm dòng này

        ], function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Xác thực tài khoản Green Mart');
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Models\Role;

class AuthController extends Controller
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
                'message' => 'Validation errors',
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

    // Đăng nhập
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

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        if ($user->status === 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.'
            ], 401);
        }

        if ($user->status === 'banned') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa'
            ], 401);
        }

        // Tạo token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
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

    // Xác thực email
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

    // Quên mật khẩu
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Tạo token reset password
        $resetToken = Str::random(60);
        $user->update([
            'password_reset_token' => $resetToken,
            'password_reset_expires_at' => Carbon::now()->addHours(1), // Token hết hạn sau 1 giờ
        ]);

        // Gửi email reset password
        $this->sendPasswordResetEmail($user, $resetToken);

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi link đặt lại mật khẩu đến email của bạn'
        ]);
    }

    // Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('password_reset_token', $request->token)
            ->where('password_reset_expires_at', '>', Carbon::now())
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'password_reset_token' => null,
            'password_reset_expires_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công'
        ]);
    }

    // Đăng nhập bằng Google
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

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ]);
    }

    // Gửi email xác thực
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

    // Gửi email reset password
    private function sendPasswordResetEmail($user, $token)
    {
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token;

        Mail::send('emails.password-reset', [
            'user' => $user,
            'resetUrl' => $resetUrl,
            'appName' => config('app.name'), // Thêm dòng này

        ], function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Đặt lại mật khẩu Green Mart');
        });
    }
}

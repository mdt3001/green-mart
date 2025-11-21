<?php
// filepath: app/Http/Controllers/Api/Auth/Customer/CustomerRegisterController.php

namespace App\Http\Controllers\Api\Auth\Customer;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCodeMail;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CustomerRegisterController extends Controller
{
    /**
     * Đăng ký tài khoản customer
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
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

            // Tạo 6-digit verification code
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            // Tạo user
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'pending',
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Gán role customer
            $customerRole = Role::where('name', 'customer')->first();

            if (!$customerRole) {
                throw new \Exception('Role customer không tồn tại trong hệ thống');
            }

            $user->roles()->attach($customerRole->id);

            // Gửi email verification code
            $this->sendVerificationEmail($user, $verificationCode);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã xác thực.',
                'data' => [
                    'email' => $user->email,
                    'expires_in' => 10 // minutes
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

    /**
     * Xác thực email với 6-digit code
     */
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)
            ->where('status', 'pending')
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại hoặc đã được xác thực'
            ], 404);
        }

        // Kiểm tra mã xác thực
        if ($user->verification_code !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực không đúng'
            ], 400);
        }

        // Kiểm tra mã đã hết hạn chưa
        if (Carbon::now()->isAfter($user->verification_code_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại mã mới.',
                'expired' => true
            ], 400);
        }

        try {
            // Kích hoạt tài khoản
            $user->update([
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
                'verification_code' => null,
                'verification_code_expires_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xác thực email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gửi lại mã xác thực
     */
    public function resendVerificationCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Kiểm tra user đã active chưa
        if ($user->status === 'active' && $user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email đã được xác thực trước đó'
            ], 409);
        }

        try {
            // Tạo code mới
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->update([
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Gửi email
            $this->sendVerificationEmail($user, $verificationCode);

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực mới đã được gửi đến email của bạn',
                'data' => [
                    'expires_in' => 10
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi gửi lại mã xác thực',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gửi email chứa verification code
     */
    private function sendVerificationEmail($user, $code)
    {
        try {
            Mail::to($user->email)->send(new VerificationCodeMail($user, $code));
        } catch (\Exception $e) {
            Log::error('Failed to send verification email: ' . $e->getMessage());
            throw new \Exception('Không thể gửi email xác thực. Vui lòng thử lại.');
        }
    }
}

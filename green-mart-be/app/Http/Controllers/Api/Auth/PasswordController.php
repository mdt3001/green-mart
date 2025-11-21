<?php
// filepath: app/Http/Controllers/Api/Auth/PasswordController.php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordResetCodeMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class PasswordController extends Controller
{
    /**
     * Quên mật khẩu - Gửi 6-digit code
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'Email không tồn tại trong hệ thống',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Kiểm tra user có active không
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản chưa được kích hoạt. Vui lòng xác thực email trước.'
            ], 403);
        }

        try {
            // Tạo 6-digit reset code
            $resetCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->update([
                'password_reset_code' => $resetCode,
                'password_reset_code_expires_at' => Carbon::now()->addMinutes(10), // Hết hạn sau 10 phút
            ]);

            // Gửi email
            Mail::to($user->email)->send(new PasswordResetCodeMail($user, $resetCode));

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực đã được gửi đến email của bạn',
                'data' => [
                    'email' => $user->email,
                    'expires_in' => 10 // minutes
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi mã xác thực. Vui lòng thử lại.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xác thực code trước khi reset password
     */
    public function verifyResetCode(Request $request)
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

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại'
            ], 404);
        }

        // Kiểm tra mã xác thực
        if ($user->password_reset_code !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực không đúng'
            ], 400);
        }

        // Kiểm tra mã đã hết hạn chưa
        if (Carbon::now()->isAfter($user->password_reset_code_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.',
                'expired' => true
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mã xác thực hợp lệ. Bạn có thể đặt lại mật khẩu.'
        ]);
    }

    /**
     * Đặt lại mật khẩu với code đã verify
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại'
            ], 404);
        }

        // Kiểm tra mã xác thực
        if ($user->password_reset_code !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực không đúng'
            ], 400);
        }

        // Kiểm tra mã đã hết hạn chưa
        if (Carbon::now()->isAfter($user->password_reset_code_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.',
                'expired' => true
            ], 400);
        }

        try {
            // Đặt lại mật khẩu
            $user->update([
                'password' => Hash::make($request->password),
                'password_reset_code' => null,
                'password_reset_code_expires_at' => null,
            ]);

            // Revoke tất cả tokens cũ (bảo mật)
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đặt lại mật khẩu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gửi lại mã reset password
     */
    public function resendResetCode(Request $request)
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

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản chưa được kích hoạt'
            ], 403);
        }

        try {
            // Tạo code mới
            $resetCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->update([
                'password_reset_code' => $resetCode,
                'password_reset_code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Gửi email
            Mail::to($user->email)->send(new PasswordResetCodeMail($user, $resetCode));

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực mới đã được gửi đến email',
                'data' => [
                    'expires_in' => 10
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi lại mã xác thực',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

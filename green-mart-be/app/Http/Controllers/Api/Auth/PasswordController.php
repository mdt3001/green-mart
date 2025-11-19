<?php

namespace App\Http\Controllers\Api\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordController extends Controller
{
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

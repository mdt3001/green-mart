<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSellerApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = $request->user();

            // Nếu không có user (token sai, hết hạn...)
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn chưa đăng nhập',
                ], 401);
            }

            // Kiểm tra xem user có role 'seller' không
            if (!$user->roles()->where('name', 'seller')->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền truy cập Seller Center.'
                ], 403);
            }
            // Load quan hệ cửa hàng nếu chưa load
            if (!$user->relationLoaded('store')) {
                $user->load('store');
            }

            $store = $user->store ?? $user->stores; // hỗ trợ cả tên cũ

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn chưa tạo cửa hàng.',
                    'action' => 'Vui lòng đăng ký bán hàng.'
                ], 403);
            }

            if ($store->status !== 'approved') {
                $message = match ($store->status) {
                    'pending'  => 'Cửa hàng của bạn đang chờ duyệt. Vui lòng chờ 24-48h.',
                    'rejected' => 'Cửa hàng của bạn đã bị từ chối. Lý do: ' . ($store->reject_reason ?? 'Không có lý do.'),
                    default    => 'Tài khoản cửa hàng chưa được kích hoạt.',
                };

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'status'  => $store->status,
                    'reject_reason' => $store->reject_reason,
                ], 403);
            }

            if (!$store->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cửa hàng của bạn đã bị vô hiệu hóa.'
                ], 403);
            }

            // Nếu mọi thứ OK → cho qua
            return $next($request);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class authSeller
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn chưa đăng nhập',
                ], 401);
            }

            // Pass nếu user có role 'seller'
            $isSeller = $user->roles()->where('name', 'seller')->exists();
            if (!$isSeller) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền truy cập',
                ], 403);
            }

            if (!$user->stores || !$user->stores->first()->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cửa hàng của bạn chưa được duyệt',
                ], 403);
            }

            // Attach store_id vào request để dùng trong controller
            $request->merge(['store_id' => $user->stores->first()->id]);
            return $next($request);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
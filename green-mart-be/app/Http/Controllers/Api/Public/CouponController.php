<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Lấy danh sách các coupon public (không cần đăng nhập)
     */
    public function index()
    {
        try {
            $coupons = Coupon::active()
                ->public()
                ->get()
                ->map(function ($coupon) {
                    return [
                        'code' => $coupon->code,
                        'description' => $coupon->description,
                        'discount' => $coupon->discount,
                        'for_new_user' => $coupon->for_new_user,
                        'for_member' => $coupon->for_member,
                        'expires_at' => $coupon->expires_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $coupons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tải danh sách mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


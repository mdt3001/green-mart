<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function getStoreActiveCoupons($storeId)
    {
        try {
            $store = Store::findOrFail($storeId);
            $coupons = $store->enabledCoupons()->get();
            return response()->json(['success' => true, 'data' => $coupons]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không thể tải danh sách mã giảm giá'], 500);
        }
    }

    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'store_id' => 'required|exists:stores,id'
        ]);

        try {
            $code = strtoupper($request->code);
            $coupon = Coupon::where('code', $code)->where('is_active', true)->first();

            if (!$coupon || $coupon->isExpired()) {
                return response()->json(['success' => false, 'message' => 'Mã giảm giá không hợp lệ'], 404);
            }

            $isEnabled = $coupon->stores()->where('stores.id', $request->store_id)->wherePivot('is_enabled', true)->exists();
            if (!$isEnabled && !$coupon->is_public) {
                return response()->json(['success' => false, 'message' => 'Mã không khả dụng cho cửa hàng này'], 400);
            }

            $user = Auth::user();
            if ($coupon->for_new_user && $user->orders()->exists()) {
                return response()->json(['success' => false, 'message' => 'Chỉ dành cho người dùng mới'], 400);
            }

            if ($coupon->for_member && !$user->is_member) {
                return response()->json(['success' => false, 'message' => 'Chỉ dành cho thành viên'], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Mã hợp lệ',
                'data' => [
                    'code' => $coupon->code,
                    'discount' => $coupon->discount,
                    'description' => $coupon->description
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi xác thực'], 500);
        }
    }
}
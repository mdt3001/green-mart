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

    /**
     * Lưu coupon vào tài khoản của user (giống Shopee)
     */
    public function saveCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:coupons,code'
        ]);

        try {
            $user = Auth::user();
            $code = strtoupper($request->code);
            $coupon = Coupon::where('code', $code)->where('is_active', true)->first();

            if (!$coupon || $coupon->isExpired()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
                ], 400);
            }

            // Kiểm tra user đã lưu coupon này chưa
            if ($user->savedCoupons()->where('coupon_code', $code)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn đã lưu mã giảm giá này rồi'
                ], 400);
            }

            // Lưu coupon
            $user->savedCoupons()->attach($code);

            return response()->json([
                'success' => true,
                'message' => 'Đã lưu mã giảm giá thành công',
                'data' => $coupon
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lưu mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa coupon khỏi tài khoản của user
     */
    public function removeSavedCoupon(Request $request, $code)
    {
        try {
            $user = Auth::user();
            $code = strtoupper($code);

            if (!$user->savedCoupons()->where('coupon_code', $code)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không tồn tại trong danh sách đã lưu'
                ], 404);
            }

            $user->savedCoupons()->detach($code);

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa mã giảm giá khỏi danh sách đã lưu'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách coupon đã lưu của user
     */
    public function getSavedCoupons(Request $request)
    {
        try {
            $user = Auth::user();
            
            // Lấy các coupon đã lưu và còn active
            $coupons = $user->savedCoupons()
                ->where('is_active', true)
                ->where(function($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->get();

            return response()->json([
                'success' => true,
                'data' => $coupons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tải danh sách mã giảm giá đã lưu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách coupon có thể dùng cho store cụ thể (bao gồm saved coupons và store coupons)
     */
    public function getAvailableCoupons(Request $request, $storeId)
    {
        try {
            $user = Auth::user();
            $store = Store::findOrFail($storeId);

            // Lấy các coupon đã lưu của user
            $savedCoupons = $user->savedCoupons()
                ->where('is_active', true)
                ->where(function($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                })
                ->get()
                ->pluck('code')
                ->toArray();

            // Lấy các coupon của store (enabled)
            $storeCoupons = $store->enabledCoupons()
                ->where(function($q) use ($savedCoupons) {
                    // Bao gồm cả public coupons và store coupons
                    $q->where('is_public', true)
                      ->orWhereIn('code', $savedCoupons)
                      ->orWhereHas('stores', function($q2) use ($store) {
                          $q2->where('stores.id', $store->id)
                             ->where('coupon_store.is_enabled', true);
                      });
                })
                ->get()
                ->map(function($coupon) use ($savedCoupons) {
                    $couponArray = $coupon->toArray();
                    $couponArray['is_saved'] = in_array($coupon->code, $savedCoupons);
                    return $couponArray;
                });

            return response()->json([
                'success' => true,
                'data' => $storeCoupons
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
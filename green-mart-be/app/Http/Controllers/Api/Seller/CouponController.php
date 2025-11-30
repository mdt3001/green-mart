<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CouponController extends Controller
{
    public function index()
    {
        try {
            $store = Auth::user()->store;
            
            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cửa hàng'
                ], 404);
            }

            // Get all active public coupons and coupons assigned to this store
            $coupons = Coupon::active()
                ->where(function($query) use ($store) {
                    $query->where('is_public', true)
                          ->orWhereHas('stores', function($q) use ($store) {
                              $q->where('stores.id', $store->id);
                          });
                })
                ->with(['stores' => function($q) use ($store) {
                    $q->where('stores.id', $store->id);
                }])
                ->get()
                ->map(function($coupon) use ($store) {
                    $storeRelation = $coupon->stores->first();
                    return [
                        'code' => $coupon->code,
                        'description' => $coupon->description,
                        'discount' => $coupon->discount,
                        'for_new_user' => $coupon->for_new_user,
                        'for_member' => $coupon->for_member,
                        'is_public' => $coupon->is_public,
                        'expires_at' => $coupon->expires_at,
                        'is_enabled' => $storeRelation ? $storeRelation->pivot->is_enabled : false,
                        'is_assigned' => $storeRelation ? true : false
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

    public function toggle(Request $request, $code)
    {
        try {
            $store = Auth::user()->store;

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy cửa hàng'
                ], 404);
            }

            $coupon = Coupon::findOrFail($code);

            // Check if coupon is assigned to this store or is public
            if (!$coupon->is_public && !$coupon->stores()->where('stores.id', $store->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không khả dụng cho cửa hàng này'
                ], 403);
            }

            // If not assigned yet, assign it first
            if (!$coupon->stores()->where('stores.id', $store->id)->exists()) {
                $coupon->stores()->attach($store->id, ['is_enabled' => true]);
                $isEnabled = true;
            } else {
                // Toggle the is_enabled status
                $currentStatus = $coupon->stores()
                    ->where('stores.id', $store->id)
                    ->first()
                    ->pivot
                    ->is_enabled;
                
                $coupon->stores()->updateExistingPivot($store->id, [
                    'is_enabled' => !$currentStatus
                ]);
                
                $isEnabled = !$currentStatus;
            }

            return response()->json([
                'success' => true,
                'message' => $isEnabled ? 'Đã kích hoạt mã giảm giá' : 'Đã vô hiệu hóa mã giảm giá',
                'data' => [
                    'is_enabled' => $isEnabled
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể cập nhật trạng thái mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
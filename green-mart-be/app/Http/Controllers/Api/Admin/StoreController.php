<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Get all coupons for a specific store
     */
    public function getCoupons($storeId)
    {
        try {
            $store = Store::with(['coupons' => function($query) {
                $query->withPivot('is_enabled');
            }])->findOrFail($storeId);

            return response()->json([
                'success' => true,
                'data' => $store->coupons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể tải danh sách mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle coupon for store (enable/disable)
     */
    public function toggleCoupon(Request $request, $storeId, $couponCode)
    {
        try {
            $store = Store::findOrFail($storeId);
            
            // Check if coupon is attached
            if (!$store->coupons()->where('code', $couponCode)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã giảm giá không được gán cho cửa hàng này'
                ], 404);
            }

            // Toggle the is_enabled status
            $currentStatus = $store->coupons()
                ->where('code', $couponCode)
                ->first()
                ->pivot
                ->is_enabled;
            
            $store->coupons()->updateExistingPivot($couponCode, [
                'is_enabled' => !$currentStatus
            ]);

            return response()->json([
                'success' => true,
                'message' => !$currentStatus ? 'Đã kích hoạt mã giảm giá' : 'Đã vô hiệu hóa mã giảm giá',
                'data' => [
                    'is_enabled' => !$currentStatus
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

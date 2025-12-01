<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    public function index()
    {
        try {
            $coupons = Coupon::with('stores')->latest()->get();
            return response()->json(['success' => true, 'data' => $coupons]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Không thể tải danh sách mã giảm giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:coupons,code',
            'description' => 'nullable|string|max:255',
            'discount' => 'required|numeric|min:0|max:100',
            'for_new_user' => 'boolean',
            'for_member' => 'boolean',
            'is_public' => 'boolean',
            'expires_at' => 'nullable|date|after:today',
            'store_ids' => 'nullable|array',
            'store_ids.*' => 'exists:stores,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $coupon = Coupon::create([
                'code' => strtoupper($request->code),
                'description' => $request->description,
                'discount' => $request->discount,
                'for_new_user' => $request->for_new_user ?? false,
                'for_member' => $request->for_member ?? false,
                'is_public' => $request->is_public ?? true,
                'expires_at' => $request->expires_at,
            ]);

            if ($request->has('store_ids') && !empty($request->store_ids)) {
                $coupon->stores()->attach($request->store_ids);
            }

            return response()->json(['success' => true, 'message' => 'Tạo mã giảm giá thành công', 'data' => $coupon->load('stores')], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không thể tạo mã giảm giá', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($code)
    {
        try {
            $coupon = Coupon::with('stores')->findOrFail($code);
            return response()->json(['success' => true, 'data' => $coupon]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy mã giảm giá'], 404);
        }
    }

    public function update(Request $request, $code)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:255',
            'discount' => 'numeric|min:0|max:100',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
            'store_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $coupon = Coupon::findOrFail($code);
            
            $updateData = array_filter($request->only([
                'description', 'discount', 'is_active', 'expires_at'
            ]), function($value) {
                return $value !== null;
            });

            $coupon->update($updateData);

            if ($request->has('store_ids')) {
                $coupon->stores()->sync($request->store_ids);
            }

            return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'data' => $coupon->load('stores')]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không thể cập nhật', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($code)
    {
        try {
            Coupon::findOrFail($code)->delete();
            return response()->json(['success' => true, 'message' => 'Xóa thành công']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không thể xóa', 'error' => $e->getMessage()], 500);
        }
    }

    public function assignToStores(Request $request, $code)
    {
        $validator = Validator::make($request->all(), [
            'store_ids' => 'required|array',
            'store_ids.*' => 'exists:stores,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $coupon = Coupon::findOrFail($code);
            $coupon->stores()->syncWithoutDetaching($request->store_ids);
            return response()->json(['success' => true, 'message' => 'Gán cửa hàng thành công', 'data' => $coupon->load('stores')]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không thể gán', 'error' => $e->getMessage()], 500);
        }
    }
}

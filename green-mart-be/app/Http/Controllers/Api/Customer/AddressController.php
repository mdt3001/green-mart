<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AddressController extends Controller
{
    /**
     * Danh sách địa chỉ
     */
    public function index(Request $request)
    {
        $addresses = $request->user()->addresses()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $addresses,
        ]);
    }

    /**
     * Tạo địa chỉ mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $address = Address::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            ...$validator->validated(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm địa chỉ thành công',
            'data' => $address,
        ], 201);
    }

    /**
     * Chi tiết địa chỉ
     */
    public function show(Request $request, string $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy địa chỉ',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $address,
        ]);
    }

    /**
     * Cập nhật địa chỉ
     */
    public function update(Request $request, string $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy địa chỉ',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'street' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:20',
            'country' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $address->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật địa chỉ thành công',
            'data' => $address->fresh(),
        ]);
    }

    /**
     * Xóa địa chỉ
     */
    public function destroy(Request $request, string $id)
    {
        $address = Address::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$address) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy địa chỉ',
            ], 404);
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa địa chỉ thành công',
        ]);
    }
}

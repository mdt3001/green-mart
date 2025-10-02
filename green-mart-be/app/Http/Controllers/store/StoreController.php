<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class StoreController extends Controller
{
    // Đăng ký cửa hàng
    public function store(Request $request)
    {
        $user = $request->user();

        // Nếu user chưa đăng nhập
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Nếu đã có cửa hàng
        $existing = Store::where('user_id', $user->id)->first();
        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'User đã đăng ký cửa hàng',
                'data' => [
                    'id' => $existing->id,
                    'name' => $existing->name,
                    'username' => $existing->username,
                    'email' => $existing->email,
                    'status' => $existing->status,
                    'is_active' => (bool) $existing->is_active,
                    'logo' => $existing->logo,
                ],
            ], 200);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|alpha_dash|unique:stores,username',
            'email' => 'required|email|unique:stores,email',
            'description' => 'required|string|max:2000',
            'address' => 'required|string|max:500',
            'contact' => 'required|string|max:100',
            'logo' => 'required|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        $payload = $validator->validated();

        // Upload logo lên Cloudinary qua Storage (giống FileUploadController)
        $logoUrl = null;
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');

            try {
                $folder = 'stores/logos';
                $path = Storage::disk('cloudinary')->putFile($folder, $file);
                $logoUrl = Storage::disk('cloudinary')->url($path);
            } catch (\Throwable $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Upload logo thất bại',
                    'errors' => $e->getMessage(),
                ], 500);
            }
        }

        // Tạo store ở trạng thái chờ duyệt
        $store = Store::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'name' => $payload['name'],
            'username' => $payload['username'],
            'email' => $payload['email'],
            'description' => $payload['description'] ?? null,
            'address' => $payload['address'] ?? null,
            'logo' => $logoUrl,
            'contact' => $payload['contact'] ?? null,
            'status' => 'inactive',
            'is_active' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký cửa hàng thành công, chờ xét duyệt',
            'data' => [
                'id' => $store->id,
                'name' => $store->name,
                'username' => $store->username,
                'email' => $store->email,
                'status' => $store->status,
                'is_active' => (bool) $store->is_active,
                'logo' => $store->logo,
            ],
        ], 201);
    }

    // Lấy cửa hàng của chính mình (tiện cho FE kiểm tra trạng thái)
    public function myStore(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401);
        }

        $store = Store::where('user_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => $store ? [
                'id' => $store->id,
                'name' => $store->name,
                'username' => $store->username,
                'email' => $store->email,
                'status' => $store->status,
                'is_active' => (bool) $store->is_active,
                'logo' => $store->logo,
            ] : null,
        ], 200);
    }
}
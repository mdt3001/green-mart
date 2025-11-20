<?php
namespace App\Http\Controllers\Api\Seller;
use App\Http\Controllers\Controller;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StoreController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Lấy thông tin cửa hàng của seller
     */
    public function show(Request $request)
    {
        $store = $request->user()->store()->with('user:id,name,email,phone_number')->first();

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }

    /**
     * Cập nhật thông tin cửa hàng
     */
    public function update(Request $request)
    {
        $store = $request->user()->store;

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:500',
            'contact' => 'nullable|string|max:20',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $validator->validated();

            // Upload logo nếu có
            if ($request->hasFile('logo')) {
                // Xóa logo cũ nếu có
                if ($store->logo) {
                    $this->cloudinaryService->deleteImage($store->logo);
                }

                $data['logo'] = $this->cloudinaryService->uploadImage(
                    $request->file('logo'),
                    'green-mart/stores/logos'
                );
            }

            $store->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật cửa hàng thành công',
                'data' => $store->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

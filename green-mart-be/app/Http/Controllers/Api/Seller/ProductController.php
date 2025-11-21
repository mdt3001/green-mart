<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Danh sách sản phẩm của seller
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;

        $products = Product::where('store_id', $store->id)
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search)
                        ->orWhere('category', 'like', $search)
                        ->orWhere('subcategory', 'like', $search);  // Thêm mới
                });
            })
            ->when(
                $request->filled('category'),
                fn($query) =>
                $query->where('category', $request->input('category'))
            )
            ->when(
                $request->filled('subcategory'),
                fn($query) =>
                $query->where('subcategory', $request->input('subcategory'))
            )
            ->when(
                $request->filled('in_stock'),
                fn($query) =>
                $query->where('in_stock', $request->boolean('in_stock'))
            )
            ->orderBy(
                $request->input('sort_by', 'created_at'),
                $request->input('sort_order', 'desc')
            )
            ->paginate($request->integer('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Tạo sản phẩm mới
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'mrp' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0|lte:mrp',
            'category' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
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
            $store = $request->user()->store;

            // Upload images
            $imageUrls = [];
            if ($request->hasFile('images')) {
                $imageUrls = $this->cloudinaryService->uploadImages(
                    $request->file('images'),
                    'green-mart/products'
                );
            }

            $product = Product::create([
                'id' => Str::uuid(),
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'mrp' => $data['mrp'],
                'price' => $data['price'],
                'category' => $data['category'] ?? null,
                'subcategory' => $data['subcategory'] ?? null,  // Thêm mới
                'images' => $imageUrls,
                'store_id' => $store->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo sản phẩm thành công',
                'data' => $product,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Chi tiết sản phẩm
     */
    public function show(Request $request, string $id)
    {
        $store = $request->user()->store;

        $product = Product::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $product,
        ]);
    }

    /**
     * Cập nhật sản phẩm
     */
    public function update(Request $request, string $id)
    {
        $store = $request->user()->store;

        $product = Product::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'mrp' => 'sometimes|numeric|min:0',
            'price' => 'sometimes|numeric|min:0|lte:mrp',
            'category' => 'nullable|string|max:255',
            'subcategory' => 'nullable|string|max:255',  // Thêm mới
            'in_stock' => 'boolean',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'string',
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

            // Xử lý xóa ảnh cũ
            if ($request->has('remove_images')) {
                $currentImages = $product->images ?? [];
                $removeImages = $request->input('remove_images');

                foreach ($removeImages as $imageUrl) {
                    $this->cloudinaryService->deleteImage($imageUrl);
                    $currentImages = array_values(array_diff($currentImages, [$imageUrl]));
                }

                $data['images'] = $currentImages;
            }

            // Upload ảnh mới
            if ($request->hasFile('images')) {
                $newImages = $this->cloudinaryService->uploadImages(
                    $request->file('images'),
                    'green-mart/products'
                );

                $data['images'] = array_merge($product->images ?? [], $newImages);
            }

            $product->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật sản phẩm thành công',
                'data' => $product->fresh(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xóa sản phẩm
     */
    public function destroy(Request $request, string $id)
    {
        $store = $request->user()->store;

        $product = Product::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        try {
            // Xóa ảnh trên Cloudinary
            if ($product->images) {
                foreach ($product->images as $imageUrl) {
                    $this->cloudinaryService->deleteImage($imageUrl);
                }
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /*
     * Thay đổi trạng thái kho hàng của sản phẩm
     */
    public function toggleStockStatus(Request $request, string $id)
    {
        $store = $request->user()->store;

        $product = Product::where('id', $id)
            ->where('store_id', $store->id)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy sản phẩm',
            ], 404);
        }

        try {
            $product->in_stock = !$product->in_stock;
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Thay đổi trạng thái kho hàng thành công',
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

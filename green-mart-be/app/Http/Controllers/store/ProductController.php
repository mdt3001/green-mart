<?php

namespace App\Http\Controllers\store;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    // Tạo sản phẩm
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'mrp' => 'required|numeric|min:0',
                'price' => 'required|numeric|min:0|lt:mrp',
                'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
                'images' => 'required|array|min:1|max:4', // Tối đa 4 ảnh
                'category' => 'required|string|max:100',
                'in_stock' => 'required|boolean',
            ]);

            // Upload ảnh lên Cloudinary
            $imagesUrl = [];
            foreach ($validated['images'] as $image) {
                $folder = 'products/images';
                $path = Storage::disk('cloudinary')->putFile($folder, $image);
                $imagesUrl[] = Storage::disk('cloudinary')->url($path);
            }

            // Lấy store_id từ middleware
            $storeId = $request->store_id;

            // Tạo sản phẩm
            $product = Product::create([
                'id' => Str::uuid(),
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'mrp' => $validated['mrp'],
                'price' => $validated['price'],
                'images' => $imagesUrl, // Lưu URLs đã upload
                'category' => $validated['category'],
                'in_stock' => $validated['in_stock'] ?? true,
                'store_id' => $storeId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sản phẩm đã được tạo thành công',
                'product' => $product->load('store'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo sản phẩm',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    // Lấy danh sách sản phẩm của seller
    public function index(Request $request)
    {
        try {
            $products = Product::where('store_id', $request->store_id)->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách sản phẩm của cửa hàng thành công',
                'products' => $products,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách sản phẩm',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    // Toggle stock of a product
    public function toggleStock(Request $request, string $id)
    {
        try {
            $storeId = $request->store_id;

            if (!$id) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID sản phẩm không được để trống',
                ], 400);
            }

            $product = Product::where('id', $id)
                ->where('store_id', $storeId)
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không tồn tại hoặc không thuộc cửa hàng của bạn',
                ], 404);
            }

            $product->in_stock = !$product->in_stock;
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật trạng thái kho thành công',
                'product' => $product->load('store'),
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật trạng thái kho',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
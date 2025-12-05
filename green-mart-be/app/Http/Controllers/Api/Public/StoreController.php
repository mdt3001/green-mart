<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Danh sách stores
     */
    public function index(Request $request)
    {
        $stores = Store::where('is_active', true)
            ->where('status', 'approved')
            ->withCount('products')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = '%' . $request->input('search') . '%';
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', $search)
                        ->orWhere('description', 'like', $search);
                });
            })
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $stores,
        ]);
    }

    /**
     * Chi tiết store theo ID
     */
    public function show(string $id)
    {
        $store = Store::where('id', $id)
            ->where('is_active', true)
            ->where('status', 'approved')
            ->withCount('products')
            ->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy cửa hàng',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }

    /**
     * Sản phẩm của store theo ID
     */
    public function products(Request $request, string $id)
    {
        $store = Store::where('id', $id)
            ->where('is_active', true)
            ->where('status', 'approved')
            ->first();

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy cửa hàng',
            ], 404);
        }

        $products = $store->products()
            ->where('in_stock', true)
            ->with('store:id,name,logo')
            ->withCount('ratings')
            ->withAvg('ratings', 'rating')
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}

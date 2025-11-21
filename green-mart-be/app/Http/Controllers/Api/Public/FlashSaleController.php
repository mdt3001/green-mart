<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FlashSaleController extends Controller
{
    /**
     * Flash sale đang diễn ra
     */
    public function index()
    {
        $now = Carbon::now();

        $flashSales = FlashSale::where('is_active', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $flashSales,
        ]);
    }

    /**
     * Chi tiết flash sale
     */
    public function show(string $id)
    {
        $now = Carbon::now();

        $flashSale = FlashSale::where('id', $id)
            ->where('is_active', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->first();

        if (!$flashSale) {
            return response()->json([
                'success' => false,
                'message' => 'Flash sale không tồn tại hoặc đã kết thúc',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $flashSale,
        ]);
    }

    /**
     * Sản phẩm trong flash sale
     */
    public function products(Request $request, string $id)
    {
        $now = Carbon::now();

        $flashSale = FlashSale::where('id', $id)
            ->where('is_active', true)
            ->where('start_time', '<=', $now)
            ->where('end_time', '>=', $now)
            ->first();

        if (!$flashSale) {
            return response()->json([
                'success' => false,
                'message' => 'Flash sale không tồn tại hoặc đã kết thúc',
            ], 404);
        }

        $products = FlashSaleProduct::where('flash_sale_id', $id)
            ->with(['product:id,name,price,mrp,images,category', 'store:id,name,logo'])
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => [
                'flash_sale' => $flashSale,
                'products' => $products,
            ],
        ]);
    }

    /**
     * Tất cả sản phẩm flash sale đang diễn ra
     */
    public function allProducts(Request $request)
    {
        $now = Carbon::now();

        $products = FlashSaleProduct::whereHas('flashSale', function ($query) use ($now) {
            $query->where('is_active', true)
                ->where('start_time', '<=', $now)
                ->where('end_time', '>=', $now);
        })
            ->with([
                'product:id,name,price,mrp,images,category',
                'store:id,name,logo',
                'flashSale:id,name,end_time'
            ])
            ->paginate($request->integer('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}

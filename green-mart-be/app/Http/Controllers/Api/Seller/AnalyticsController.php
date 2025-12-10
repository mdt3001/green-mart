<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Dashboard overview
     */
    public function overview(Request $request)
    {
        $store = $request->user()->store;
        $period = $request->input('period', '30'); // days

        $startDate = Carbon::now()->subDays($period);

        // Tổng doanh thu - tính từ order_items để chính xác hơn, chỉ tính đơn đã giao hoặc đã thanh toán
        $totalRevenue = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.store_id', $store->id)
            ->where('orders.created_at', '>=', $startDate)
            ->where('is_paid', true)
            ->select(DB::raw('SUM(order_items.quantity * order_items.price) as total'))
            ->value('total') ?? 0;

        // Tổng đơn hàng
        $totalOrders = Order::where('store_id', $store->id)
            ->where('created_at', '>=', $startDate)
            ->count();

        // Tổng sản phẩm
        $totalProducts = Product::where('store_id', $store->id)->count();
    

        // Đơn hàng theo trạng thái
        $ordersByStatus = Order::where('store_id', $store->id)
            ->where('created_at', '>=', $startDate)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Sản phẩm bán chạy
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.store_id', $store->id)
            ->where('orders.created_at', '>=', $startDate)
            ->select(
                'products.id',
                'products.name',
                'products.images',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.images')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        // Doanh thu theo ngày - tính từ order_items
        $revenueByDay = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.store_id', $store->id)
            ->where('orders.created_at', '>=', $startDate)
            ->where('is_paid', true)
            ->select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue'),
                DB::raw('COUNT(DISTINCT orders.id) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'orders_by_status' => $ordersByStatus,
                'top_products' => $topProducts,
                'revenue_by_day' => $revenueByDay,
            ],
        ]);
    }

    /**
     * Thống kê sản phẩm
     */
    public function products(Request $request)
    {
        $store = $request->user()->store;

        $totalProducts = Product::where('store_id', $store->id)->count();
        $inStockProducts = Product::where('store_id', $store->id)
            ->where('in_stock', true)
            ->count();
        $outOfStockProducts = $totalProducts - $inStockProducts;

        // Sản phẩm theo danh mục
        $productsByCategory = Product::where('store_id', $store->id)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_products' => $totalProducts,
                'in_stock' => $inStockProducts,
                'out_of_stock' => $outOfStockProducts,
                'by_category' => $productsByCategory,
            ],
        ]);
    }
}

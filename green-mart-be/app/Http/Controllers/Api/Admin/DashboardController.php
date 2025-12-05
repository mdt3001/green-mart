<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request->user());

        // Get statistics
        $totalProducts = Product::count();
        $totalRevenue = Order::where('is_paid', true)->sum('total') ?? 0;
        $totalOrders = Order::count();
        $totalStores = Store::where('status', 'approved')->count();

        // Get orders per day for the chart
        $ordersPerDay = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subDays(90))
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'totalProducts' => $totalProducts,
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalStores' => $totalStores,
                'ordersPerDay' => $ordersPerDay,
            ],
        ]);
    }

    private function ensureAdmin($user): void
    {
        if (!$user || !$user->roles()->where('name', 'admin')->exists()) {
            abort(Response::HTTP_FORBIDDEN, 'Bạn không có quyền thực hiện thao tác này.');
        }
    }
}
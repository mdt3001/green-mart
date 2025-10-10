<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

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

    // Lấy thông tin cửa hàng theo username
    public function getByUsername(Request $request, string $username)
    {
        try {
            $store = Store::where('username', $username)
                ->where('is_active', true)
                ->with(['user:id,name,email'])
                ->first();

            if (!$store) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cửa hàng không tồn tại hoặc chưa được kích hoạt',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin cửa hàng thành công',
                'data' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'username' => $store->username,
                    'description' => $store->description,
                    'address' => $store->address,
                    'logo' => $store->logo,
                    'email' => $store->email,
                    'contact' => $store->contact,
                    'status' => $store->status,
                    'is_active' => (bool) $store->is_active,
                    'owner' => [
                        'name' => $store->user->name,
                        'email' => $store->user->email,
                    ],
                ],
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin cửa hàng',
                'error' => $th->getMessage(),
            ], 500);
        }
    }


    // lay dashboard data cho seller

    // Thêm vào StoreController
    public function dashboard(Request $request)
    {
        try {
            $storeId = $request->store_id; // Từ middleware authSeller

            // Tổng số sản phẩm
            $totalProducts = Product::where('store_id', $storeId)->count();

            // Tổng số đơn hàng
            $totalOrders = Order::where('store_id', $storeId)->count();

            // Tổng doanh thu (từ order_items)
            $totalEarnings = OrderItem::whereHas('order', function ($query) use ($storeId) {
                $query->where('store_id', $storeId)
                    ->where('is_paid', true);
            })->sum(DB::raw('quantity * price'));

            // Đơn hàng theo trạng thái
            $ordersByStatus = Order::where('store_id', $storeId)
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();

            // Sản phẩm bán chạy (top 5)
            $topProducts = Product::where('store_id', $storeId)
                ->withCount(['orderItems as total_sold' => function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->where('is_paid', true);
                    });
                }])
                ->orderBy('total_sold', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'price', 'images']);

            // Doanh thu theo tháng (6 tháng gần nhất)
            // $monthlyEarnings = OrderItem::whereHas('order', function ($query) use ($storeId) {
            //     $query->where('store_id', $storeId)
            //         ->where('is_paid', true)
            //         ->where('created_at', '>=', now()->subMonths(6));
            // })
            //     ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(quantity * price) as earnings')
            //     ->groupBy('month')
            //     ->orderBy('month')
            //     ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy dữ liệu dashboard thành công',
                'data' => [
                    'summary' => [
                        'total_products' => $totalProducts,
                        'total_orders' => $totalOrders,
                        'total_earnings' => (float) $totalEarnings,
                    ],
                    'orders_by_status' => $ordersByStatus,
                    'top_products' => $topProducts,
                    // 'monthly_earnings' => $monthlyEarnings,
                ],
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy dữ liệu dashboard',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}

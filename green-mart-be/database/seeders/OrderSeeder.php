<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Store;
use App\Models\Address;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy customer users
        $customers = User::whereHas('roles', function ($query) {
            $query->where('name', 'customer');
        })->get();

        // Lấy stores active
        $stores = Store::where('is_active', true)->get();

        if ($customers->isEmpty() || $stores->isEmpty()) {
            $this->command->warn('Không tìm thấy customer hoặc store. Vui lòng chạy UserSeeder và StoreSeeder trước.');
            return;
        }

        // Đảm bảo mỗi customer có ít nhất 1 Address hợp lệ cho model hiện tại
        foreach ($customers as $customer) {
            $existingAddress = $customer->addresses()->first();
            if (!$existingAddress) {
                Address::create([
                    'id' => Str::uuid(),
                    'user_id' => $customer->id,
                    'name' => 'Địa chỉ nhà',
                    'email' => $customer->email,
                    'street' => $customer->address ?: '123 Đường ABC',
                    'city' => 'TP. Hồ Chí Minh',
                    'state' => 'Quận 1',
                    'zip' => '700000',
                    'country' => 'Việt Nam',
                    'phone' => $customer->phone_number ?: '0123456789',
                ]);
            }
        }

        // Dữ liệu đơn hàng mẫu (status/payment_method sẽ được map sang enum hợp lệ)
        $orders = [
            [
                'total' => 32000000,
                'status' => 'delivered',
                'is_paid' => true,
                'payment_method' => 'credit_card',
                'is_coupon_used' => false,
                'customer_email' => 'customer@greenmart.com',
                'store_username' => 'techstore_pro'
            ],
            [
                'total' => 25000000,
                'status' => 'shipped',
                'is_paid' => true,
                'payment_method' => 'bank_transfer',
                'is_coupon_used' => true,
                'coupon' => ['code' => 'SALE10', 'discount' => 10],
                'customer_email' => 'customer@greenmart.com',
                'store_username' => 'techstore_pro'
            ],
            [
                'total' => 1800000,
                'status' => 'confirmed',
                'is_paid' => false,
                'payment_method' => 'cod',
                'is_coupon_used' => false,
                'customer_email' => 'customerseller@greenmart.com',
                'store_username' => 'fashion_hub'
            ],
            [
                'total' => 350000,
                'status' => 'pending',
                'is_paid' => false,
                'payment_method' => 'cod',
                'is_coupon_used' => false,
                'customer_email' => 'customerseller@greenmart.com',
                'store_username' => 'fashion_hub'
            ],
            [
                'total' => 250000,
                'status' => 'delivered',
                'is_paid' => true,
                'payment_method' => 'credit_card',
                'is_coupon_used' => false,
                'customer_email' => 'customer@greenmart.com',
                'store_username' => 'fresh_market'
            ],
            [
                'total' => 12000000,
                'status' => 'delivered',
                'is_paid' => true,
                'payment_method' => 'bank_transfer',
                'is_coupon_used' => true,
                'coupon' => ['code' => 'FURNITURE20', 'discount' => 20],
                'customer_email' => 'customerseller@greenmart.com',
                'store_username' => 'home_living'
            ],
            [
                'total' => 600000,
                'status' => 'shipped',
                'is_paid' => true,
                'payment_method' => 'credit_card',
                'is_coupon_used' => false,
                'customer_email' => 'customer@greenmart.com',
                'store_username' => 'beauty_corner'
            ],
            [
                'total' => 280000,
                'status' => 'delivered',
                'is_paid' => true,
                'payment_method' => 'credit_card',
                'is_coupon_used' => false,
                'customer_email' => 'customerseller@greenmart.com',
                'store_username' => 'book_paradise'
            ],
            [
                'total' => 150000,
                'status' => 'confirmed',
                'is_paid' => false,
                'payment_method' => 'cod',
                'is_coupon_used' => false,
                'customer_email' => 'customer@greenmart.com',
                'store_username' => 'garden_center'
            ],
            [
                'total' => 380000,
                'status' => 'delivered',
                'is_paid' => true,
                'payment_method' => 'bank_transfer',
                'is_coupon_used' => false,
                'customer_email' => 'customerseller@greenmart.com',
                'store_username' => 'auto_parts_plus'
            ]
        ];

        // Map sang enum hợp lệ của migration
        $statusMap = [
            'pending' => 'ORDER_PLACED',
            'confirmed' => 'PROCESSING',
            'shipped' => 'SHIPPED',
            'delivered' => 'DELIVERED',
        ];
        $methodMap = [
            'cod' => 'COD',
            'credit_card' => 'STRIPE',
            'bank_transfer' => 'STRIPE',
        ];

        foreach ($orders as $orderData) {
            $customer = $customers->where('email', $orderData['customer_email'])->first();
            $store = $stores->where('username', $orderData['store_username'])->first();
            $address = $customer?->addresses()->first();

            if (!$customer || !$store || !$address) {
                $this->command->warn("Không tìm thấy customer, store hoặc address cho order ({$orderData['customer_email']} - {$orderData['store_username']})");
                continue;
            }

            $status = $statusMap[strtolower($orderData['status'])] ?? 'ORDER_PLACED';
            $paymentMethod = $methodMap[strtolower($orderData['payment_method'])] ?? null;

            Order::create([
                'id' => Str::uuid(),
                'total' => $orderData['total'],
                'status' => $status,
                'user_id' => $customer->id,
                'store_id' => $store->id,
                'address_id' => $address->id,
                'is_paid' => $orderData['is_paid'],
                'payment_method' => $paymentMethod,
                'is_coupon_used' => $orderData['is_coupon_used'],
                'coupon' => $orderData['coupon'] ?? null,
            ]);

            $this->command->info("Đã tạo order cho {$customer->email} tại store {$store->username} ({$status}/{$paymentMethod})");
        }

        $this->command->info('Đã tạo orders thành công.');
    }
}
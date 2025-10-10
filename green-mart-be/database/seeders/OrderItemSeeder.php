<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::all();
        $products = Product::all();

        if ($orders->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Không tìm thấy orders hoặc products. Vui lòng chạy OrderSeeder và ProductSeeder trước.');
            return;
        }

        $orderItems = [
            // Order 1 - iPhone 15 Pro Max
            [
                'order_id' => $orders->where('total', 32000000)->first()?->id,
                'product_name' => 'iPhone 15 Pro Max',
                'quantity' => 1,
                'price' => 32000000
            ],
            
            // Order 2 - Samsung Galaxy S24 Ultra
            [
                'order_id' => $orders->where('total', 25000000)->first()?->id,
                'product_name' => 'Samsung Galaxy S24 Ultra',
                'quantity' => 1,
                'price' => 25000000
            ],
            
            // Order 3 - Váy dạ hội
            [
                'order_id' => $orders->where('total', 1800000)->first()?->id,
                'product_name' => 'Váy dạ hội nữ',
                'quantity' => 1,
                'price' => 1800000
            ],
            
            // Order 4 - Áo thun nam
            [
                'order_id' => $orders->where('total', 350000)->first()?->id,
                'product_name' => 'Áo thun nam cao cấp',
                'quantity' => 1,
                'price' => 350000
            ],
            
            // Order 5 - Thịt bò tươi
            [
                'order_id' => $orders->where('total', 250000)->first()?->id,
                'product_name' => 'Thịt bò tươi',
                'quantity' => 1,
                'price' => 250000
            ],
            
            // Order 6 - Sofa 3 chỗ
            [
                'order_id' => $orders->where('total', 12000000)->first()?->id,
                'product_name' => 'Sofa 3 chỗ ngồi',
                'quantity' => 1,
                'price' => 12000000
            ],
            
            // Order 7 - Kem dưỡng da
            [
                'order_id' => $orders->where('total', 600000)->first()?->id,
                'product_name' => 'Kem dưỡng da mặt',
                'quantity' => 1,
                'price' => 600000
            ],
            
            // Order 8 - Sách Clean Code
            [
                'order_id' => $orders->where('total', 280000)->first()?->id,
                'product_name' => 'Sách "Clean Code"',
                'quantity' => 1,
                'price' => 280000
            ],
            
            // Order 9 - Cây Monstera
            [
                'order_id' => $orders->where('total', 150000)->first()?->id,
                'product_name' => 'Cây Monstera Deliciosa',
                'quantity' => 1,
                'price' => 150000
            ],
            
            // Order 10 - Dầu nhớt
            [
                'order_id' => $orders->where('total', 380000)->first()?->id,
                'product_name' => 'Dầu nhớt động cơ 5W-30',
                'quantity' => 1,
                'price' => 380000
            ]
        ];

        foreach ($orderItems as $itemData) {
            if (!$itemData['order_id']) {
                $this->command->warn("Không tìm thấy order cho item: {$itemData['product_name']}");
                continue;
            }

            $product = $products->where('name', $itemData['product_name'])->first();
            
            if (!$product) {
                $this->command->warn("Không tìm thấy product: {$itemData['product_name']}");
                continue;
            }

            OrderItem::create([
                'order_id' => $itemData['order_id'],
                'product_id' => $product->id,
                'quantity' => $itemData['quantity'],
                'price' => $itemData['price'],
            ]);

            $this->command->info("Đã tạo order item: {$itemData['product_name']} - Qty: {$itemData['quantity']}");
        }

        $this->command->info('Đã tạo thành công ' . count($orderItems) . ' order items.');
    }
}
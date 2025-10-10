<?php

namespace Database\Seeders;

use App\Models\Rating;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RatingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::limit(3)->get();
        $orders = Order::where('is_paid', true)->limit(5)->get();

        if ($users->isEmpty() || $orders->isEmpty()) {
            $this->command->warn('Thiếu users hoặc orders để seed ratings. Chạy UserSeeder/OrderSeeder trước.');
            return;
        }

        foreach ($orders as $i => $order) {
            $product = $order->orderItems()->first()?->product;
            if (!$product) {
                continue;
            }

            $user = $users[$i % $users->count()];
            Rating::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'order_id' => $order->id,
                ],
                [
                    'id' => Str::uuid(),
                    'rating' => 4 + ($i % 2), // 4 hoặc 5 sao
                    'review' => 'Sản phẩm chất lượng, giao hàng nhanh.',
                ]
            );
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\FlashSale;
use App\Models\FlashSaleProduct;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FlashSaleProductSeeder extends Seeder
{
    public function run(): void
    {
        $activeSale = FlashSale::where('is_active', true)->first();
        if (!$activeSale) {
            $this->command->warn('Chưa có FlashSale active. Vui lòng chạy FlashSaleSeeder trước.');
            return;
        }

        $products = Product::inRandomOrder()->take(6)->get();
        if ($products->isEmpty()) {
            $this->command->warn('Chưa có Product. Vui lòng chạy ProductSeeder trước.');
            return;
        }

        foreach ($products as $index => $product) {
            FlashSaleProduct::updateOrCreate(
                [
                    'flash_sale_id' => $activeSale->id,
                    'product_id' => $product->id,
                ],
                [
                    'id' => Str::uuid(),
                    'store_id' => $product->store_id,
                    'discount_percent' => [10, 15, 20, 25, 30][($index % 5)],
                    'stock_limit' => 50 + ($index * 10),
                ]
            );
        }
    }
}
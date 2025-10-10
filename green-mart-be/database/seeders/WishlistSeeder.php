<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WishlistSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereHas('roles', fn($q) => $q->whereIn('name', ['customer', 'seller']))->get();
        $products = Product::inRandomOrder()->take(10)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Thiếu users hoặc products để seed wishlists. Chạy UserSeeder/ProductSeeder trước.');
            return;
        }

        foreach ($users as $user) {
            foreach ($products->random(min(3, $products->count())) as $product) {
                Wishlist::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'id' => Str::uuid(),
                    ]
                );
            }
        }
    }
}
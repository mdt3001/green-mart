<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            UserSeeder::class,
            AddressSeeder::class,
            OrderSeeder::class,
            OrderItemSeeder::class,

            // Các seeder mới
            CouponSeeder::class,
            FlashSaleSeeder::class,
            FlashSaleProductSeeder::class,
            RatingSeeder::class,
            WishlistSeeder::class,

        ]);
    }
}

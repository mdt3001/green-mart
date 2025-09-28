<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Admin permissions
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_users'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_stores'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_products'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_orders'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_coupons'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_flash_sales'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'view_analytics'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'approve_sellers'],
            
            // Customer permissions
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'place_orders'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_profile'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_addresses'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_wishlist'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'rate_products'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'apply_coupons'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'request_seller_account'],
            
            // Seller permissions
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_own_store'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_own_products'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_own_orders'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'view_own_analytics'],
            ['id' => \Illuminate\Support\Str::uuid(), 'name' => 'manage_own_flash_sales'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
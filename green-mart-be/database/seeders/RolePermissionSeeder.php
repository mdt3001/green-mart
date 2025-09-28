<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Admin role - all permissions
        $adminRole = Role::where('name', 'admin')->first();
        $adminPermissions = Permission::all();
        $adminRole->permissions()->attach($adminPermissions->pluck('id'));

        // Customer role permissions
        $customerRole = Role::where('name', 'customer')->first();
        $customerPermissions = Permission::whereIn('name', [
            'place_orders',
            'manage_profile',
            'manage_addresses',
            'manage_wishlist',
            'rate_products',
            'apply_coupons',
            'request_seller_account'
        ])->get();
        $customerRole->permissions()->attach($customerPermissions->pluck('id'));

        // Seller role permissions
        $sellerRole = Role::where('name', 'seller')->first();
        $sellerPermissions = Permission::whereIn('name', [
            'manage_own_store',
            'manage_own_products',
            'manage_own_orders',
            'view_own_analytics',
            'manage_flash_sales',
            // Seller cũng có quyền customer
            'place_orders',
            'manage_profile',
            'manage_addresses',
            'manage_wishlist',
            'rate_products',
            'apply_coupons'
        ])->get();
        $sellerRole->permissions()->attach($sellerPermissions->pluck('id'));
    }
}
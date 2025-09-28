<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        $admin = User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Admin',
            'email' => 'admin@greenmart.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'phone_number' => '0123456789',
            'address' => 'Admin Address',
        ]);

        // Assign admin role
        $adminRole = Role::where('name', 'admin')->first();
        $admin->roles()->attach($adminRole->id);

        // Customer user
        $customer = User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Customer',
            'email' => 'customer@greenmart.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'phone_number' => '0987654321',
            'address' => 'Customer Address',
        ]);

        // Assign customer role
        $customerRole = Role::where('name', 'customer')->first();
        $customer->roles()->attach($customerRole->id);

        // Seller user
        $seller = User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Seller',
            'email' => 'seller@greenmart.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'phone_number' => '0555555555',
            'address' => 'Seller Address',
        ]);

        // Assign seller role
        $sellerRole = Role::where('name', 'seller')->first();
        $seller->roles()->attach($sellerRole->id);

        // User vừa là customer vừa là seller
        $customerSeller = User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Customer Seller',
            'email' => 'customerseller@greenmart.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'phone_number' => '0777777777',
            'address' => 'Customer Seller Address',
        ]);

        // Assign both customer and seller roles
        $customerSeller->roles()->attach([$customerRole->id, $sellerRole->id]);
    }
}
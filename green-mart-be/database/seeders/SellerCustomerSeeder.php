<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SellerCustomerSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy roles
        $sellerRole = Role::where('name', 'seller')->first();
        $customerRole = Role::where('name', 'customer')->first();

        if (!$sellerRole || !$customerRole) {
            $this->command->error('Roles không tồn tại. Vui lòng chạy RoleSeeder trước.');
            return;
        }

        // Tạo 5 Sellers với Store
        $sellerNames = [
            'Nguyễn Văn A',
            'Trần Thị B',
            'Lê Văn C',
            'Phạm Thị D',
            'Hoàng Văn E',
        ];

        $storeNames = [
            'Cửa hàng Rau sạch A',
            'Cửa hàng Trái cây B',
            'Cửa hàng Thực phẩm C',
            'Cửa hàng Đồ khô D',
            'Cửa hàng Tươi sống E',
        ];

        $storeDescriptions = [
            'Chuyên cung cấp rau sạch, an toàn, không hóa chất',
            'Trái cây tươi ngon, nhập khẩu và trong nước',
            'Thực phẩm đa dạng, chất lượng cao',
            'Đồ khô, gia vị, đầy đủ các loại',
            'Thực phẩm tươi sống, đảm bảo vệ sinh',
        ];

        for ($i = 0; $i < 5; $i++) {
            // Tạo user seller
            $seller = User::create([
                'id' => Str::uuid(),
                'name' => $sellerNames[$i],
                'email' => "seller" . ($i + 1) . "@greenmart.com",
                'password' => Hash::make('password'),
                'status' => 'active',
                'phone_number' => '0' . (9 + $i) . '12345678',
                'address' => 'Địa chỉ seller ' . ($i + 1) . ', TP. Hồ Chí Minh',
            ]);

            // Assign seller role
            $seller->roles()->attach($sellerRole->id);

            // Tạo store cho seller
            $username = 'store' . ($i + 1);
            Store::create([
                'id' => Str::uuid(),
                'user_id' => $seller->id,
                'name' => $storeNames[$i],
                'description' => $storeDescriptions[$i],
                'username' => $username,
                'address' => 'Địa chỉ cửa hàng ' . ($i + 1) . ', TP. Hồ Chí Minh',
                'status' => 'approved',
                'is_active' => true,
                'email' => "store" . ($i + 1) . "@greenmart.com",
                'contact' => '0' . (9 + $i) . '12345678',
            ]);

            $this->command->info("Đã tạo seller: {$seller->name} với store: {$storeNames[$i]}");
        }

        // Tạo 5 Customers
        $customerNames = [
            'Nguyễn Thị F',
            'Trần Văn G',
            'Lê Thị H',
            'Phạm Văn I',
            'Hoàng Thị K',
        ];

        for ($i = 0; $i < 5; $i++) {
            $customer = User::create([
                'id' => Str::uuid(),
                'name' => $customerNames[$i],
                'email' => "customer" . ($i + 1) . "@greenmart.com",
                'password' => Hash::make('password'),
                'status' => 'active',
                'phone_number' => '0' . (8 + $i) . '98765432',
                'address' => 'Địa chỉ customer ' . ($i + 1) . ', TP. Hồ Chí Minh',
            ]);

            // Assign customer role
            $customer->roles()->attach($customerRole->id);

            $this->command->info("Đã tạo customer: {$customer->name}");
        }

        $this->command->info('Đã tạo thành công 5 sellers và 5 customers!');
        $this->command->info('Tất cả tài khoản đều có mật khẩu: password');
    }
}


<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy tất cả users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('Không tìm thấy user nào. Vui lòng chạy UserSeeder trước.');
            return;
        }

        $addresses = [
            // Admin addresses
            [
                'name' => 'Văn phòng chính',
                'email' => 'admin@greenmart.com',
                'street' => '123 Nguyễn Huệ',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 1',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0123456789',
                'user_email' => 'admin@greenmart.com'
            ],
            [
                'name' => 'Nhà riêng',
                'email' => 'admin@greenmart.com',
                'street' => '456 Lê Lợi',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 3',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0123456789',
                'user_email' => 'admin@greenmart.com'
            ],

            // Customer addresses
            [
                'name' => 'Nhà riêng',
                'email' => 'customer@greenmart.com',
                'street' => '789 Điện Biên Phủ',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận Bình Thạnh',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0987654321',
                'user_email' => 'customer@greenmart.com'
            ],
            [
                'name' => 'Công ty',
                'email' => 'customer@greenmart.com',
                'street' => '321 Võ Văn Tần',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 3',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0987654321',
                'user_email' => 'customer@greenmart.com'
            ],
            [
                'name' => 'Nhà bố mẹ',
                'email' => 'customer@greenmart.com',
                'street' => '654 Cách Mạng Tháng 8',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 10',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0987654321',
                'user_email' => 'customer@greenmart.com'
            ],

            // Seller addresses
            [
                'name' => 'Cửa hàng',
                'email' => 'seller@greenmart.com',
                'street' => '987 Nguyễn Thị Minh Khai',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 1',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0555555555',
                'user_email' => 'seller@greenmart.com'
            ],
            [
                'name' => 'Nhà riêng',
                'email' => 'seller@greenmart.com',
                'street' => '147 Đồng Khởi',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 1',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0555555555',
                'user_email' => 'seller@greenmart.com'
            ],

            // Customer-Seller addresses
            [
                'name' => 'Nhà riêng',
                'email' => 'customerseller@greenmart.com',
                'street' => '258 Lê Văn Sỹ',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 3',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0777777777',
                'user_email' => 'customerseller@greenmart.com'
            ],
            [
                'name' => 'Cửa hàng',
                'email' => 'customerseller@greenmart.com',
                'street' => '369 Tô Hiến Thành',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 10',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0777777777',
                'user_email' => 'customerseller@greenmart.com'
            ],
            [
                'name' => 'Văn phòng',
                'email' => 'customerseller@greenmart.com',
                'street' => '741 Điện Biên Phủ',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận Bình Thạnh',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0777777777',
                'user_email' => 'customerseller@greenmart.com'
            ],

            // Thêm một số địa chỉ khác cho customer để test
            [
                'name' => 'Nhà bạn gái',
                'email' => 'customer@greenmart.com',
                'street' => '852 Nguyễn Văn Cừ',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 5',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0987654321',
                'user_email' => 'customer@greenmart.com'
            ],
            [
                'name' => 'Ký túc xá',
                'email' => 'customer@greenmart.com',
                'street' => '963 Lý Thường Kiệt',
                'city' => 'TP. Hồ Chí Minh',
                'state' => 'Quận 11',
                'zip' => '700000',
                'country' => 'Việt Nam',
                'phone' => '0987654321',
                'user_email' => 'customer@greenmart.com'
            ]
        ];

        foreach ($addresses as $index => $addressData) {
            $user = $users->where('email', $addressData['user_email'])->first();

            if (!$user) {
                $this->command->warn("Không tìm thấy user với email: {$addressData['user_email']}");
                continue;
            }

            Address::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $addressData['name'],
                'email' => $addressData['email'],
                'street' => $addressData['street'],
                'city' => $addressData['city'],
                'state' => $addressData['state'],
                'zip' => $addressData['zip'],
                'country' => $addressData['country'],
                'phone' => $addressData['phone'],
            ]);

            $this->command->info("Đã tạo địa chỉ: {$addressData['name']} - {$user->name}");
        }

        $this->command->info('Đã tạo thành công ' . count($addresses) . ' địa chỉ.');
    }
}

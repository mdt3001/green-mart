<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy các user có role seller
        $sellerUsers = User::whereHas('roles', function ($query) {
            $query->where('name', 'seller');
        })->get();

        if ($sellerUsers->isEmpty()) {
            $this->command->warn('Không tìm thấy user nào có role seller. Vui lòng chạy UserSeeder trước.');
            return;
        }

        // Bộ template store để gán cho seller (sẽ xoay vòng nếu số seller > số template)
        $templates = [
            [
                'name' => 'TechStore Pro',
                'description' => 'Cửa hàng điện tử chuyên nghiệp, cung cấp các sản phẩm công nghệ cao cấp.',
                'username' => 'techstore_pro',
                'address' => '123 Nguyễn Huệ, Quận 1, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/techstore_logo.jpg',
                'email' => 'techstore@example.com',
                'contact' => '0901234567'
            ],
            [
                'name' => 'Fashion Hub',
                'description' => 'Cửa hàng thời trang đa dạng với phong cách trẻ trung và hiện đại.',
                'username' => 'fashion_hub',
                'address' => '456 Lê Lợi, Quận 3, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/fashion_logo.jpg',
                'email' => 'fashionhub@example.com',
                'contact' => '0907654321'
            ],
            [
                'name' => 'Fresh Market',
                'description' => 'Thực phẩm tươi sống, rau củ quả hữu cơ, thịt cá tươi ngon.',
                'username' => 'fresh_market',
                'address' => '789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/freshmarket_logo.jpg',
                'email' => 'freshmarket@example.com',
                'contact' => '0909876543'
            ],
            [
                'name' => 'Home & Living',
                'description' => 'Nội thất và đồ gia dụng cao cấp cho không gian sống tiện nghi.',
                'username' => 'home_living',
                'address' => '321 Võ Văn Tần, Quận 3, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/home_logo.jpg',
                'email' => 'homeliving@example.com',
                'contact' => '0904567890'
            ],
            [
                'name' => 'Beauty Corner',
                'description' => 'Mỹ phẩm và chăm sóc sắc đẹp chính hãng.',
                'username' => 'beauty_corner',
                'address' => '987 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/beauty_logo.jpg',
                'email' => 'beautycorner@example.com',
                'contact' => '0906543210'
            ],
            [
                'name' => 'Book Paradise',
                'description' => 'Hiệu sách trực tuyến với hàng nghìn đầu sách đa dạng.',
                'username' => 'book_paradise',
                'address' => '147 Đồng Khởi, Quận 1, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/books_logo.jpg',
                'email' => 'bookparadise@example.com',
                'contact' => '0907890123'
            ],
        ];

        $created = 0;

        foreach ($sellerUsers as $index => $sellerUser) {
            // Nếu user này đã có store → bỏ qua để không vi phạm unique user_id
            $existingForUser = Store::where('user_id', $sellerUser->id)->first();
            if ($existingForUser) {
                $this->command->warn("User {$sellerUser->email} đã có store, bỏ qua.");
                continue;
            }

            // Chọn template xoay vòng
            $tpl = $templates[$index % count($templates)];

            // Đảm bảo username không trùng (nếu tồn tại thì thêm hậu tố _{index})
            $username = $tpl['username'];
            if (Store::where('username', $username)->exists()) {
                $username = $username . '_' . ($index + 1);
            }

            Store::create([
                'id' => Str::uuid(),
                'user_id' => $sellerUser->id,
                'name' => $tpl['name'],
                'description' => $tpl['description'],
                'username' => $username,
                'address' => $tpl['address'],
                'status' => $tpl['status'],
                'is_active' => $tpl['is_active'],
                'logo' => $tpl['logo'],
                'email' => $tpl['email'],
                'contact' => $tpl['contact'],
            ]);

            $this->command->info("Đã tạo store: {$tpl['name']} ({$username}) cho {$sellerUser->email}");
            $created++;
        }

        $this->command->info("Đã tạo thành công {$created} store(s) (mỗi seller tối đa 1 store).");
    }
}
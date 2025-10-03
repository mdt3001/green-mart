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

        $stores = [
            [
                'name' => 'TechStore Pro',
                'description' => 'Cửa hàng điện tử chuyên nghiệp, cung cấp các sản phẩm công nghệ cao cấp từ Apple, Samsung, và các thương hiệu nổi tiếng khác.',
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
                'description' => 'Cửa hàng thời trang đa dạng với các sản phẩm từ quần áo, giày dép đến phụ kiện. Phong cách trẻ trung và hiện đại.',
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
                'description' => 'Cửa hàng thực phẩm tươi sống, chuyên cung cấp rau củ quả hữu cơ, thịt cá tươi ngon và các sản phẩm địa phương.',
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
                'description' => 'Cửa hàng nội thất và đồ gia dụng cao cấp. Mang đến không gian sống đẹp và tiện nghi cho mọi gia đình.',
                'username' => 'home_living',
                'address' => '321 Võ Văn Tần, Quận 3, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/home_logo.jpg',
                'email' => 'homeliving@example.com',
                'contact' => '0904567890'
            ],
            [
                'name' => 'Sports World',
                'description' => 'Cửa hàng thể thao chuyên nghiệp, cung cấp dụng cụ thể thao, quần áo thể thao và giày chạy bộ từ các thương hiệu nổi tiếng.',
                'username' => 'sports_world',
                'address' => '654 Cách Mạng Tháng 8, Quận 10, TP.HCM',
                'status' => 'inactive',
                'is_active' => false,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/sports_logo.jpg',
                'email' => 'sportsworld@example.com',
                'contact' => '0903216547'
            ],
            [
                'name' => 'Beauty Corner',
                'description' => 'Cửa hàng mỹ phẩm và chăm sóc sắc đẹp. Cung cấp các sản phẩm làm đẹp chính hãng từ các thương hiệu nổi tiếng thế giới.',
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
                'description' => 'Hiệu sách trực tuyến với hàng nghìn đầu sách đa dạng từ văn học, khoa học, kỹ thuật đến sách thiếu nhi và giáo trình.',
                'username' => 'book_paradise',
                'address' => '147 Đồng Khởi, Quận 1, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/books_logo.jpg',
                'email' => 'bookparadise@example.com',
                'contact' => '0907890123'
            ],
            [
                'name' => 'Pet Care Store',
                'description' => 'Cửa hàng chuyên cung cấp thức ăn, đồ chơi và phụ kiện cho thú cưng. Chăm sóc toàn diện cho người bạn bốn chân của bạn.',
                'username' => 'pet_care_store',
                'address' => '258 Lê Văn Sỹ, Quận 3, TP.HCM',
                'status' => 'suspended',
                'is_active' => false,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/pet_logo.jpg',
                'email' => 'petcare@example.com',
                'contact' => '0900123456'
            ],
            [
                'name' => 'Garden Center',
                'description' => 'Trung tâm cây cảnh và vật tư nông nghiệp. Cung cấp cây giống, phân bón, dụng cụ làm vườn và tư vấn chăm sóc cây.',
                'username' => 'garden_center',
                'address' => '369 Tô Hiến Thành, Quận 10, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/garden_logo.jpg',
                'email' => 'gardencenter@example.com',
                'contact' => '0903456789'
            ],
            [
                'name' => 'Auto Parts Plus',
                'description' => 'Cửa hàng phụ tùng ô tô và xe máy chính hãng. Cung cấp đầy đủ các loại phụ tùng, dầu nhớt và phụ kiện xe.',
                'username' => 'auto_parts_plus',
                'address' => '741 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
                'status' => 'active',
                'is_active' => true,
                'logo' => 'https://res.cloudinary.com/example/image/upload/v1234567890/stores/auto_logo.jpg',
                'email' => 'autoparts@example.com',
                'contact' => '0906789012'
            ]
        ];

        foreach ($stores as $index => $storeData) {
            // Chỉ tạo store cho user seller (không tạo cho user customer-seller)
            $sellerUser = $sellerUsers->where('email', 'seller@greenmart.com')->first();
            
            if (!$sellerUser) {
                $sellerUser = $sellerUsers->first(); // Fallback to first seller user
            }

            Store::create([
                'id' => Str::uuid(),
                'user_id' => $sellerUser->id,
                'name' => $storeData['name'],
                'description' => $storeData['description'],
                'username' => $storeData['username'],
                'address' => $storeData['address'],
                'status' => $storeData['status'],
                'is_active' => $storeData['is_active'],
                'logo' => $storeData['logo'],
                'email' => $storeData['email'],
                'contact' => $storeData['contact'],
            ]);

            $this->command->info("Đã tạo store: {$storeData['name']} ({$storeData['username']})");
        }

        $this->command->info('Đã tạo thành công ' . count($stores) . ' stores.');
    }
}
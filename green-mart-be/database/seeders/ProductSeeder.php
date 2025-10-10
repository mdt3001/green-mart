<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Lấy các store đã active
        $stores = Store::where('is_active', true)->get();

        if ($stores->isEmpty()) {
            $this->command->warn('Không tìm thấy store nào active. Vui lòng chạy StoreSeeder trước.');
            return;
        }

        $products = [
            // TechStore Pro products
            [
                'name' => 'iPhone 15 Pro Max',
                'description' => 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và màn hình Super Retina XDR 6.7 inch.',
                'mrp' => 35000000,
                'price' => 32000000,
                'category' => 'Điện thoại',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/iphone15_1.jpg',
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/iphone15_2.jpg'
                ],
                'store_username' => 'techstore_pro'
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'description' => 'Samsung Galaxy S24 Ultra với S Pen, camera 200MP và màn hình Dynamic AMOLED 2X.',
                'mrp' => 28000000,
                'price' => 25000000,
                'category' => 'Điện thoại',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/samsung_s24_1.jpg'
                ],
                'store_username' => 'techstore_pro'
            ],
            [
                'name' => 'MacBook Pro M3',
                'description' => 'MacBook Pro 14 inch với chip M3, 16GB RAM và 512GB SSD.',
                'mrp' => 45000000,
                'price' => 42000000,
                'category' => 'Laptop',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/macbook_pro_1.jpg',
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/macbook_pro_2.jpg'
                ],
                'store_username' => 'techstore_pro'
            ],

            // Fashion Hub products
            [
                'name' => 'Áo thun nam cao cấp',
                'description' => 'Áo thun nam chất liệu cotton 100%, thiết kế đơn giản và thoải mái.',
                'mrp' => 500000,
                'price' => 350000,
                'category' => 'Thời trang nam',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/ao_thun_nam_1.jpg'
                ],
                'store_username' => 'fashion_hub'
            ],
            [
                'name' => 'Váy dạ hội nữ',
                'description' => 'Váy dạ hội sang trọng, phù hợp cho các sự kiện quan trọng.',
                'mrp' => 2500000,
                'price' => 1800000,
                'category' => 'Thời trang nữ',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/vay_da_hoi_1.jpg',
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/vay_da_hoi_2.jpg'
                ],
                'store_username' => 'fashion_hub'
            ],

            // Fresh Market products
            [
                'name' => 'Rau xanh hữu cơ',
                'description' => 'Rau xanh được trồng hữu cơ, không sử dụng thuốc trừ sâu.',
                'mrp' => 50000,
                'price' => 35000,
                'category' => 'Rau củ',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/rau_xanh_1.jpg'
                ],
                'store_username' => 'fresh_market'
            ],
            [
                'name' => 'Thịt bò tươi',
                'description' => 'Thịt bò tươi ngon, được chọn lọc kỹ càng.',
                'mrp' => 300000,
                'price' => 250000,
                'category' => 'Thịt cá',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/thit_bo_1.jpg'
                ],
                'store_username' => 'fresh_market'
            ],

            // Home & Living products
            [
                'name' => 'Sofa 3 chỗ ngồi',
                'description' => 'Sofa hiện đại, chất liệu da cao cấp, màu xám sang trọng.',
                'mrp' => 15000000,
                'price' => 12000000,
                'category' => 'Nội thất',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/sofa_3_cho_1.jpg',
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/sofa_3_cho_2.jpg'
                ],
                'store_username' => 'home_living'
            ],
            [
                'name' => 'Bàn ăn gỗ óc chó',
                'description' => 'Bàn ăn gỗ óc chó tự nhiên, thiết kế tinh tế và bền đẹp.',
                'mrp' => 8000000,
                'price' => 6500000,
                'category' => 'Nội thất',
                'in_stock' => false,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/ban_an_go_1.jpg'
                ],
                'store_username' => 'home_living'
            ],

            // Beauty Corner products
            [
                'name' => 'Kem dưỡng da mặt',
                'description' => 'Kem dưỡng da mặt chống lão hóa, phù hợp cho mọi loại da.',
                'mrp' => 800000,
                'price' => 600000,
                'category' => 'Mỹ phẩm',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/kem_duong_da_1.jpg'
                ],
                'store_username' => 'beauty_corner'
            ],

            // Book Paradise products
            [
                'name' => 'Sách "Clean Code"',
                'description' => 'Cuốn sách kinh điển về lập trình, giúp viết code sạch và dễ bảo trì.',
                'mrp' => 350000,
                'price' => 280000,
                'category' => 'Sách kỹ thuật',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/clean_code_1.jpg'
                ],
                'store_username' => 'book_paradise'
            ],

            // Garden Center products
            [
                'name' => 'Cây Monstera Deliciosa',
                'description' => 'Cây Monstera Deliciosa trang trí nội thất, dễ chăm sóc.',
                'mrp' => 200000,
                'price' => 150000,
                'category' => 'Cây cảnh',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/monstera_1.jpg'
                ],
                'store_username' => 'garden_center'
            ],

            // Auto Parts Plus products
            [
                'name' => 'Dầu nhớt động cơ 5W-30',
                'description' => 'Dầu nhớt động cơ chất lượng cao, phù hợp cho xe ô tô.',
                'mrp' => 450000,
                'price' => 380000,
                'category' => 'Phụ tùng xe',
                'in_stock' => true,
                'images' => [
                    'https://res.cloudinary.com/example/image/upload/v1234567890/products/dau_nhot_1.jpg'
                ],
                'store_username' => 'auto_parts_plus'
            ]
        ];

        foreach ($products as $productData) {
            $store = $stores->where('username', $productData['store_username'])->first();
            
            if (!$store) {
                $this->command->warn("Không tìm thấy store với username: {$productData['store_username']}");
                continue;
            }

            Product::create([
                'id' => Str::uuid(),
                'name' => $productData['name'],
                'description' => $productData['description'],
                'mrp' => $productData['mrp'],
                'price' => $productData['price'],
                'images' => $productData['images'],
                'category' => $productData['category'],
                'in_stock' => $productData['in_stock'],
                'store_id' => $store->id,
            ]);

            $this->command->info("Đã tạo sản phẩm: {$productData['name']} - {$store->name}");
        }

        $this->command->info('Đã tạo thành công ' . count($products) . ' sản phẩm.');
    }
}
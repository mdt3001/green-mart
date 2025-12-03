<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dữ liệu danh mục từ bạn cung cấp
        $data = [
            [
                'name' => "Trái cây tươi",
                'subcategories' => [
                    "Trái cây theo mùa",
                    "Táo - Lê",
                    "Cam - Quýt - Bưởi",
                    "Chuối",
                    "Xoài",
                    "Dưa các loại",
                    "Trái cây nhập khẩu",
                ],
            ],
            [
                'name' => "Rau củ tươi",
                'subcategories' => [
                    "Rau lá",
                    "Củ quả",
                    "Rau gia vị",
                    "Nấm tươi",
                    "Rau hữu cơ (Organic)",
                ],
            ],
            [
                'name' => "Thịt & Hải sản",
                'subcategories' => [
                    "Thịt heo sạch",
                    "Thịt bò",
                    "Gia cầm",
                    "Trứng gia cầm",
                    "Cá tươi",
                    "Tôm - Cua - Ghẹ",
                    "Mực - Bạch tuộc",
                    "Hải sản có vỏ",
                ],
            ],
            [
                'name' => "Đồ ăn vặt",
                'subcategories' => [
                    "Hạt dinh dưỡng",
                    "Bánh snack",
                    "Trái cây sấy",
                    "Thanh năng lượng",
                ],
            ],
            [
                'name' => "Đồ uống",
                'subcategories' => [
                    "Nước suối",
                    "Nước ép trái cây",
                    "Trà & Cà phê",
                    "Sữa các loại",
                    "Đồ uống dinh dưỡng",
                ],
            ],
            [
                'name' => "Làm đẹp & Sức khỏe",
                'subcategories' => [
                    "Chăm sóc da",
                    "Chăm sóc tóc",
                    "Vệ sinh cá nhân",
                    "Sản phẩm hữu cơ",
                    "Vitamin & TPCN",
                ],
            ],
            [
                'name' => "Bánh mì & Bánh ngọt",
                'subcategories' => ["Bánh mì tươi", "Bánh ngọt", "Bánh quy", "Bánh nướng"],
            ],
            [
                'name' => "Nguyên liệu làm bánh",
                'subcategories' => [
                    "Bột mì",
                    "Ca cao & Socola",
                    "Bơ – Kem – Phô mai",
                    "Hương liệu & Phụ gia",
                    "Đường – Men nở",
                ],
            ],
            [
                'name' => "Đồ khô – Gia vị nấu ăn",
                'subcategories' => [
                    "Gia vị (Muối – Đường – Tiêu)",
                    "Nước mắm – Nước tương",
                    "Ngũ cốc – Đậu các loại",
                    "Gạo – Nếp",
                    "Mì – Miến – Bún khô",
                ],
            ],
            [
                'name' => "Thực phẩm cho người tiểu đường",
                'subcategories' => [
                    "Sữa tiểu đường",
                    "Đồ uống không đường",
                    "Thực phẩm GI thấp",
                    "Ngũ cốc không đường",
                    "Snack ít đường",
                ],
            ],
            [
                'name' => "Chất tẩy rửa gia dụng",
                'subcategories' => [
                    "Nước rửa chén",
                    "Nước lau nhà",
                    "Nước giặt",
                    "Tẩy rửa vệ sinh",
                    "Khử mùi – Diệt khuẩn",
                ],
            ],
            [
                'name' => "Dầu ăn",
                'subcategories' => [
                    "Dầu oliu",
                    "Dầu hướng dương",
                    "Dầu đậu nành",
                    "Dầu gạo",
                    "Dầu phộng",
                    "Dầu mè",
                ],
            ],
        ];

        // Reset bảng categories trước khi seed (tùy chọn, để tránh trùng lặp khi chạy nhiều lần)
        // Lưu ý: Nếu có ràng buộc khóa ngoại, cần tắt check FK trước
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Category::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        foreach ($data as $catData) {
            // 1. Tạo Category Cha (Parent)
            $parent = Category::create([
                'name' => $catData['name'],
                'slug' => Str::slug($catData['name']),
                'parent_id' => null, // Là danh mục gốc
            ]);

            // 2. Tạo Subcategories (Children)
            foreach ($catData['subcategories'] as $subName) {
                Category::create([
                    'name' => $subName,
                    'slug' => Str::slug($subName),
                    'parent_id' => $parent->id, // Gán ID của cha vừa tạo
                ]);
            }
        }
    }
}

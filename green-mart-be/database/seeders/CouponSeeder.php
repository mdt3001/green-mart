<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'description' => 'Giảm 10% cho người dùng mới',
                'discount' => 10,
                'for_new_user' => true,
                'for_member' => false,
                'is_public' => true,
                'expires_at' => Carbon::now()->addMonths(6),
            ],
            [
                'code' => 'MEMBER15',
                'description' => 'Giảm 15% cho thành viên',
                'discount' => 15,
                'for_new_user' => false,
                'for_member' => true,
                'is_public' => false,
                'expires_at' => Carbon::now()->addMonths(3),
            ],
            [
                'code' => 'FLASH20',
                'description' => 'Giảm 20% trong đợt Flash Sale',
                'discount' => 20,
                'for_new_user' => false,
                'for_member' => false,
                'is_public' => true,
                'expires_at' => Carbon::now()->addMonth(),
            ],
        ];

        foreach ($coupons as $c) {
            Coupon::updateOrCreate(['code' => $c['code']], $c);
        }
    }
}
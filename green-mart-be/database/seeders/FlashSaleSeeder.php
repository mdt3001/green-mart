<?php

namespace Database\Seeders;

use App\Models\FlashSale;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class FlashSaleSeeder extends Seeder
{
    public function run(): void
    {
        $sales = [
            [
                'id' => Str::uuid(),
                'name' => 'Flash Sale Tháng Này',
                'start_time' => Carbon::now()->subDays(1),
                'end_time' => Carbon::now()->addDays(5),
                'is_active' => true,
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Flash Sale Sắp Tới',
                'start_time' => Carbon::now()->addDays(10),
                'end_time' => Carbon::now()->addDays(12),
                'is_active' => false,
            ],
        ];

        foreach ($sales as $s) {
            FlashSale::updateOrCreate(['name' => $s['name']], $s);
        }
    }
}
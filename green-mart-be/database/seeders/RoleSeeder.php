<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'admin',
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'customer',
            ],
            [
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => 'seller',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
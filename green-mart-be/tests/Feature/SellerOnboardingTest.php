<?php

namespace Tests\Feature;

use App\Mail\SellerApproved;
use App\Mail\SellerRegistrationSubmitted;
use App\Mail\SellerRejected;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SellerOnboardingTest extends TestCase
{
    use RefreshDatabase;

    protected Role $adminRole;
    protected Role $sellerRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::create([
            'id' => Str::uuid(),
            'name' => 'admin',
        ]);

        $this->sellerRole = Role::create([
            'id' => Str::uuid(),
            'name' => 'seller',
        ]);
    }

    public function test_seller_can_submit_registration_request(): void
    {
        Mail::fake();

        $payload = [
            'name' => 'New Seller',
            'email' => 'seller@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'phone_number' => '0909999999',
            'address' => '123 Street',
            'store_name' => 'Seller Store',
            'store_username' => 'seller_store',
            'store_email' => 'store@example.com',
            'store_address' => 'Store Address',
            'store_contact' => '0901111222',
        ];

        $response = $this->postJson('/api/auth/seller/register', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('users', [
            'email' => 'seller@example.com',
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('stores', [
            'email' => 'store@example.com',
            'status' => 'pending',
            'is_active' => false,
        ]);

        Mail::assertSent(SellerRegistrationSubmitted::class);
    }

    public function test_admin_can_approve_pending_store(): void
    {
        Mail::fake();

        $admin = User::factory()->create([
            'status' => 'active',
        ]);
        $admin->roles()->attach($this->adminRole->id);

        $seller = User::factory()->create([
            'status' => 'pending',
        ]);
        $seller->roles()->attach($this->sellerRole->id);

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Pending Store',
            'username' => 'pending_store',
            'email' => 'pending@store.com',
            'status' => 'pending',
            'is_active' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/admin/sellers/{$store->id}/approve");

        $response->assertOk();

        $store->refresh();
        $seller->refresh();

        $this->assertEquals('approved', $store->status);
        $this->assertTrue($store->is_active);
        $this->assertEquals('active', $seller->status);
        $this->assertNotNull($seller->activation_token);

        Mail::assertSent(SellerApproved::class);
    }

    public function test_admin_can_reject_pending_store(): void
    {
        Mail::fake();

        $admin = User::factory()->create([
            'status' => 'active',
        ]);
        $admin->roles()->attach($this->adminRole->id);

        $seller = User::factory()->create([
            'status' => 'pending',
        ]);
        $seller->roles()->attach($this->sellerRole->id);

        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Pending Store 2',
            'username' => 'pending_store_2',
            'email' => 'pending2@store.com',
            'status' => 'pending',
            'is_active' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson("/api/admin/sellers/{$store->id}/reject", [
            'reason' => 'Thiếu giấy tờ',
        ]);

        $response->assertOk();

        $store->refresh();

        $this->assertEquals('rejected', $store->status);
        $this->assertFalse($store->is_active);
        $this->assertEquals('Thiếu giấy tờ', $store->reject_reason);

        Mail::assertSent(SellerRejected::class);
    }
}


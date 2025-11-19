<?php

namespace App\Http\Controllers\Api\Auth\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\SellerRegisterRequest;
use App\Mail\SellerRegistrationSubmitted;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class SellerRegisterController extends Controller
{
    public function register(SellerRegisterRequest $request)
    {
        try {
            $store = DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->input('name'),
                    'email' => $request->input('email'),
                    'password' => Hash::make($request->input('password')),
                    'status' => 'pending',
                    'phone_number' => $request->input('phone_number'),
                    'address' => $request->input('address'),
                    'activation_token' => Str::random(60),
                ]);

                $sellerRoleId = Role::where('name', 'seller')->value('id');
                if (!$sellerRoleId) {
                    throw new \RuntimeException('Không tìm thấy role seller, vui lòng seed dữ liệu.');
                }

                $user->roles()->attach($sellerRoleId);

                $store = Store::create([
                    'user_id' => $user->id,
                    'name' => $request->input('store_name'),
                    'description' => $request->input('store_description'),
                    'username' => $request->input('store_username'),
                    'address' => $request->input('store_address'),
                    'email' => $request->input('store_email'),
                    'contact' => $request->input('store_contact'),
                    'logo' => $request->input('store_logo'),
                    'status' => 'pending',
                    'is_active' => false,
                    'reject_reason' => null,
                    'BRCTaxCode' => $request->input('brc_tax_code'),
                    'BRCNumber' => $request->input('brc_number'),
                    'BRCDateOfissue' => $request->input('brc_date_of_issue'),
                    'BRCPlaceOfissue' => $request->input('brc_place_of_issue'),
                    'BRCImages' => $request->input('brc_images'),
                ]);

                return $store->load('user');
            });

            Mail::to($store->user->email)->send(new SellerRegistrationSubmitted($store));

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký seller thành công. Vui lòng chờ admin duyệt trong 1-2 ngày.',
                'data' => [
                    'user_id' => $store->user_id,
                    'store_id' => $store->id,
                    'status' => 'pending',
                ],
            ], 201);
        } catch (Throwable $throwable) {
            report($throwable);

            return response()->json([
                'success' => false,
                'message' => 'Không thể đăng ký seller lúc này',
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }
}

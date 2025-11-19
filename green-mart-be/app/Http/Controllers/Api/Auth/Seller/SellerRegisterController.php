<?php

namespace App\Http\Controllers\Api\Auth\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Mail\SellerRegistrationSubmitted;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Throwable;

class SellerRegisterController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'store_name' => 'required|string|max:255',
            'store_username' => 'required|string|max:255|unique:stores,username',
            'store_email' => 'required|email|max:255|unique:stores,email',
            'store_description' => 'nullable|string',
            'store_address' => 'nullable|string|max:500',
            'store_contact' => 'nullable|string|max:20',
            'store_logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'brc_tax_code' => 'nullable|string|max:100',
            'brc_number' => 'nullable|string|max:100',
            'brc_date_of_issue' => 'nullable|date',
            'brc_place_of_issue' => 'nullable|string|max:255',
            'brc_images' => 'nullable|array|max:5',
            'brc_images.*' => 'image|mimes:jpg,jpeg,png,webp,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $payload = $validator->validated();

            // Upload store logo to Cloudinary if exists
            $logoUrl = null;
            if ($request->hasFile('store_logo')) {
                $logoUrl = $this->cloudinaryService->uploadImage(
                    $request->file('store_logo'),
                    'green-mart/stores/logos'
                );

                if (!$logoUrl) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không thể upload logo. Vui lòng thử lại.',
                    ], 500);
                }
            }

            // Upload BRC images to Cloudinary if exists
            $brcImageUrls = [];
            if ($request->hasFile('brc_images')) {
                $brcImageUrls = $this->cloudinaryService->uploadImages(
                    $request->file('brc_images'),
                    'green-mart/stores/brc-documents'
                );

                if (count($brcImageUrls) !== count($request->file('brc_images'))) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Không thể upload một số ảnh BRC. Vui lòng thử lại.',
                    ], 500);
                }
            }

            $store = DB::transaction(function () use ($payload, $logoUrl, $brcImageUrls) {
                $user = User::create([
                    'name' => $payload['name'],
                    'email' => $payload['email'],
                    'password' => Hash::make($payload['password']),
                    'status' => 'pending',
                    'phone_number' => $payload['phone_number'] ?? null,
                    'address' => $payload['address'] ?? null,
                    'activation_token' => Str::random(60),
                ]);

                $sellerRoleId = Role::where('name', 'seller')->value('id');
                if (!$sellerRoleId) {
                    throw new \RuntimeException('Không tìm thấy role seller, vui lòng seed dữ liệu.');
                }

                $user->roles()->attach($sellerRoleId);

                $store = Store::create([
                    'user_id' => $user->id,
                    'name' => $payload['store_name'],
                    'description' => $payload['store_description'] ?? null,
                    'username' => $payload['store_username'],
                    'address' => $payload['store_address'] ?? null,
                    'email' => $payload['store_email'],
                    'contact' => $payload['store_contact'] ?? null,
                    'logo' => $logoUrl,
                    'status' => 'pending',
                    'is_active' => false,
                    'reject_reason' => null,
                    'BRCTaxCode' => $payload['brc_tax_code'] ?? null,
                    'BRCNumber' => $payload['brc_number'] ?? null,
                    'BRCDateOfissue' => $payload['brc_date_of_issue'] ?? null,
                    'BRCPlaceOfissue' => $payload['brc_place_of_issue'] ?? null,
                    'BRCImages' => !empty($brcImageUrls) ? $brcImageUrls : null,
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

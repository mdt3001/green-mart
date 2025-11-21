<?php
// filepath: app/Http/Controllers/Api/Auth/Seller/SellerRegisterController.php

namespace App\Http\Controllers\Api\Auth\Seller;

use App\Http\Controllers\Controller;
use App\Mail\VerificationCodeMail;
use App\Mail\SellerRegistrationSubmitted;
use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use App\Services\CloudinaryService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class SellerRegisterController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    /**
     * Đăng ký seller - Gửi 6-digit code để verify email
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // User info
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',

            // Store info
            'store_name' => 'required|string|max:255',
            'store_username' => 'required|string|max:255|unique:stores,username|alpha_dash',
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
            // Upload store logo if exists
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

            // Upload BRC images
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

            DB::beginTransaction();

            // Tạo 6-digit verification code
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            // Tạo user
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'pending', // Chờ verify email
                'phone_number' => $request->phone_number,
                'address' => $request->address,
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Gán role seller
            $sellerRole = Role::where('name', 'seller')->first();

            if (!$sellerRole) {
                throw new \Exception('Role seller không tồn tại. Vui lòng chạy seeder.');
            }

            $user->roles()->attach($sellerRole->id);

            // Tạo store (chờ admin duyệt)
            $store = Store::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $request->store_name,
                'username' => $request->store_username,
                'email' => $request->store_email,
                'description' => $request->store_description,
                'address' => $request->store_address,
                'contact' => $request->store_contact,
                'logo' => $logoUrl,
                'status' => 'pending', // Chờ admin duyệt
                'is_active' => false,
                'BRCTaxCode' => $request->brc_tax_code,
                'BRCNumber' => $request->brc_number,
                'BRCDateOfissue' => $request->brc_date_of_issue,
                'BRCPlaceOfissue' => $request->brc_place_of_issue,
                'BRCImages' => json_encode($brcImageUrls),
            ]);

            DB::commit();

            // Gửi email verification code
            try {
                Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));
            } catch (\Exception $e) {
                Log::error('Failed to send verification email: ' . $e->getMessage());
            }

            // Gửi email thông báo cho admin (không chặn flow)
            try {
                Mail::to(config('mail.admin_email', 'admin@greenmart.com'))
                    ->send(new SellerRegistrationSubmitted($store));
            } catch (\Exception $e) {
                Log::error('Failed to send admin notification: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã xác thực.',
                'data' => [
                    'email' => $user->email,
                    'expires_in' => 10, // minutes
                    'store_status' => 'pending', // Chờ admin duyệt
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            // Cleanup uploaded images on error
            if (isset($logoUrl) && $logoUrl) {
                $this->cloudinaryService->deleteImage($logoUrl);
            }
            if (isset($brcImageUrls) && !empty($brcImageUrls)) {
                foreach ($brcImageUrls as $imageUrl) {
                    $this->cloudinaryService->deleteImage($imageUrl);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Đăng ký thất bại. Vui lòng thử lại.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Xác thực email với 6-digit code
     */
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)
            ->whereHas('roles', fn($query) => $query->where('name', 'seller'))
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại'
            ], 404);
        }

        // Kiểm tra đã verify chưa
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email đã được xác thực trước đó'
            ], 409);
        }

        // Kiểm tra mã xác thực
        if ($user->verification_code !== $request->code) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực không đúng'
            ], 400);
        }

        // Kiểm tra mã đã hết hạn chưa
        if (Carbon::now()->isAfter($user->verification_code_expires_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.',
                'expired' => true
            ], 400);
        }

        try {
            // Verify email (user vẫn pending, chờ admin duyệt store)
            $user->update([
                'email_verified_at' => Carbon::now(),
                'verification_code' => null,
                'verification_code_expires_at' => null,
            ]);

            $store = $user->store;

            return response()->json([
                'success' => true,
                'message' => 'Xác thực email thành công! Vui lòng chờ admin phê duyệt cửa hàng (1-2 ngày làm việc).',
                'data' => [
                    'store_status' => $store->status,
                    'store_name' => $store->name,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xác thực',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Gửi lại mã xác thực
     */
    public function resendVerificationCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)
            ->whereHas('roles', fn($query) => $query->where('name', 'seller'))
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tài khoản seller với email này'
            ], 404);
        }

        // Kiểm tra đã verify chưa
        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'Email đã được xác thực'
            ], 409);
        }

        try {
            // Tạo code mới
            $verificationCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $user->update([
                'verification_code' => $verificationCode,
                'verification_code_expires_at' => Carbon::now()->addMinutes(10),
            ]);

            // Gửi email
            Mail::to($user->email)->send(new VerificationCodeMail($user, $verificationCode));

            return response()->json([
                'success' => true,
                'message' => 'Mã xác thực mới đã được gửi đến email',
                'data' => [
                    'expires_in' => 10
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể gửi lại mã xác thực',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

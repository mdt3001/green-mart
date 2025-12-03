<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\StoreApprovalController;
use App\Http\Controllers\Api\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;

use App\Http\Controllers\Api\Auth\Seller\SellerActivationController;
use App\Http\Controllers\Api\Auth\Seller\SellerAuthController;
use App\Http\Controllers\Api\Auth\Seller\SellerRegisterController;

use App\Http\Controllers\Api\Auth\Customer\CustomerAuthController;
use App\Http\Controllers\Api\Auth\Customer\CustomerRegisterController;
use App\Http\Controllers\Api\Auth\Customer\SocialLoginController;

use App\Http\Controllers\Api\Seller\AnalyticsController;
use App\Http\Controllers\Api\Seller\ProductController;
use App\Http\Controllers\Api\Seller\StoreController;
use App\Http\Controllers\Api\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Api\Seller\CouponController as SellerCouponController;

use App\Http\Middleware\CheckSellerApproved;

use App\Http\Controllers\Api\Customer\ProfileController;
use App\Http\Controllers\Api\Customer\AddressController;
use App\Http\Controllers\Api\Customer\WishlistController;
use App\Http\Controllers\Api\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\Customer\ReviewController;
use App\Http\Controllers\Api\Customer\CartController;
use App\Http\Controllers\Api\Customer\CouponController as CustomerCouponController;

// Public Controllers
use App\Http\Controllers\Api\Public\ProductController as PublicProductController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\Public\StoreController as PublicStoreController;
use App\Http\Controllers\Api\Public\SearchController;
use App\Http\Controllers\Api\Public\FlashSaleController;

use App\Http\Controllers\Api\Auth\PasswordController;

use Illuminate\Support\Facades\Route;

//public

Route::prefix('public')->group(function () {
    // Products
    Route::get('products', [PublicProductController::class, 'index']);
    Route::get('products/{id}', [PublicProductController::class, 'show']);
    Route::get('products/{id}/related', [PublicProductController::class, 'related']);

    // Categories
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{id}/products', [CategoryController::class, 'products']);

    // Stores
    Route::get('stores', [PublicStoreController::class, 'index']);
    Route::get('stores/{username}', [PublicStoreController::class, 'show']);
    Route::get('stores/{username}/products', [PublicStoreController::class, 'products']);

    // Search
    Route::get('search', [SearchController::class, 'search']);
    Route::get('search/suggestions', [SearchController::class, 'suggestions']);

    // Flash Sales
    Route::get('flash-sales', [FlashSaleController::class, 'index']);
    Route::get('flash-sales/products', [FlashSaleController::class, 'allProducts']);
    Route::get('flash-sales/{id}', [FlashSaleController::class, 'show']);
    Route::get('flash-sales/{id}/products', [FlashSaleController::class, 'products']);
});

//auth    

Route::prefix('auth')->group(function () {
    Route::post('seller/register', [SellerRegisterController::class, 'register']);
    Route::post('seller/login', [SellerAuthController::class, 'login']);
    Route::post('seller/activate', [SellerActivationController::class, 'activate']);
    Route::post('seller/verify-email', [SellerRegisterController::class, 'verifyEmail']);
    Route::post('seller/resend-verification', [SellerRegisterController::class, 'resendVerificationCode']);
    Route::post('seller/check-store-status', [SellerActivationController::class, 'checkStoreStatus']);

    Route::post('customer/register', [CustomerRegisterController::class, 'register']);
    Route::post('customer/login', [CustomerAuthController::class, 'login']);
    Route::post('customer/login/google', [SocialLoginController::class, 'googleLogin']);
    Route::post('customer/verify-email', [CustomerRegisterController::class, 'verifyEmail']);
    Route::post('customer/resend-verification', [CustomerRegisterController::class, 'resendVerificationCode']);

    Route::post('password/forgot', [PasswordController::class, 'forgotPassword']);
    Route::post('password/reset', [PasswordController::class, 'resetPassword']);

    Route::post('admin/login', [CustomerAuthController::class, 'login']);
});

//admin

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('dashboard', [DashboardController::class, 'index']);

    // Store Management
    Route::get('sellers/pending', [StoreApprovalController::class, 'index']);
    Route::post('sellers/toggle-active/{store}', [StoreApprovalController::class, 'toggleActive']);
    Route::post('sellers/approve/{store}', [StoreApprovalController::class, 'approve']);
    Route::post('sellers/reject/{store}', [StoreApprovalController::class, 'reject']);

    // Order Management
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::put('orders/{order}', [OrderController::class, 'update']);

    // Coupon Management
    Route::apiResource('coupons', AdminCouponController::class);
    Route::post('coupons/{code}/assign-stores', [AdminCouponController::class, 'assignToStores']);

    // Store Coupon Management (Admin managing store coupons)
    Route::get('stores/{storeId}/coupons', [AdminStoreController::class, 'getCoupons']);
    Route::post('stores/{storeId}/coupons/{couponCode}/toggle', [AdminStoreController::class, 'toggleCoupon']);
});

//seller

Route::middleware(['auth:sanctum', CheckSellerApproved::class])->prefix('seller')->group(function () {
    // Store management
    Route::get('store', [StoreController::class, 'show']);
    Route::put('store', [StoreController::class, 'update']);

    // Products management
    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
    Route::put('products/toggle-stock/{id}', [ProductController::class, 'toggleStockStatus']);

    // Orders management
    Route::get('orders', [SellerOrderController::class, 'index']);
    Route::get('orders/{id}', [SellerOrderController::class, 'show']);
    Route::patch('orders/{id}/status', [SellerOrderController::class, 'updateStatus']);

    // Analytics
    Route::get('analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('analytics/products', [AnalyticsController::class, 'products']);

    // Seller Coupon Routes
    Route::get('coupons', [SellerCouponController::class, 'index']);
    Route::post('coupons/{code}/toggle', [SellerCouponController::class, 'toggle']);
});

// customer
Route::middleware('auth:sanctum')->prefix('customer')->group(function () {
    // Profile
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::post('profile/change-password', [ProfileController::class, 'changePassword']);

    // Addresses
    Route::apiResource('addresses', AddressController::class);

    // Wishlist
    Route::get('wishlist', [WishlistController::class, 'index']);
    Route::post('wishlist', [WishlistController::class, 'store']);
    Route::delete('wishlist/{id}', [WishlistController::class, 'destroy']);

    // Cart
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart/add', [CartController::class, 'add']);
    Route::put('cart/update', [CartController::class, 'update']);
    Route::delete('cart/remove/{productId}', [CartController::class, 'remove']);
    Route::delete('cart/clear', [CartController::class, 'clear']);

    // Orders
    Route::get('orders', [CustomerOrderController::class, 'index']);
    Route::post('orders', [CustomerOrderController::class, 'store']);
    Route::get('orders/{id}', [CustomerOrderController::class, 'show']);
    Route::delete('orders/{id}/cancel', [CustomerOrderController::class, 'cancel']);

    // Reviews
    Route::get('reviews', [ReviewController::class, 'index']);
    Route::post('reviews', [ReviewController::class, 'store']);

    // Customer Coupon Routes
    Route::get('stores/{storeId}/coupons', [CustomerCouponController::class, 'getStoreActiveCoupons']);
    Route::post('coupons/validate', [CustomerCouponController::class, 'validateCoupon']);
});

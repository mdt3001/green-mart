<?php

use App\Http\Controllers\Api\Admin\StoreApprovalController;
use App\Http\Controllers\Api\Auth\Seller\SellerActivationController;
use App\Http\Controllers\Api\Auth\Seller\SellerAuthController;
use App\Http\Controllers\Api\Auth\Seller\SellerRegisterController;
use App\Http\Controllers\Api\Auth\Customer\CustomerAuthController;
use App\Http\Controllers\Api\Auth\Customer\CustomerRegisterController;
use App\Http\Controllers\Api\Auth\Customer\SocialLoginController;
use App\Http\Controllers\Api\Seller\AnalyticsController;
use App\Http\Controllers\Api\Seller\OrderController;
use App\Http\Controllers\Api\Seller\ProductController;
use App\Http\Controllers\Api\Seller\StoreController;
use App\Http\Middleware\CheckSellerApproved;

use App\Http\Controllers\Api\Auth\PasswordController;


use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('seller/register', [SellerRegisterController::class, 'register']);
    Route::post('seller/login', [SellerAuthController::class, 'login']);
    Route::post('seller/activate', [SellerActivationController::class, 'activate']);

    Route::post('customer/register', [CustomerRegisterController::class, 'register']);
    Route::post('customer/login', [CustomerAuthController::class, 'login']);
    Route::post('customer/login/google', [SocialLoginController::class, 'googleLogin']);
    Route::post('customer/verify-email', [CustomerRegisterController::class, 'verifyEmail']);

    Route::post('password/forgot', [PasswordController::class, 'forgotPassword']);
    Route::post('password/reset', [PasswordController::class, 'resetPassword']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('sellers/pending', [StoreApprovalController::class, 'index']);
    Route::post('sellers/{store}/approve', [StoreApprovalController::class, 'approve']);
    Route::post('sellers/{store}/reject', [StoreApprovalController::class, 'reject']);
});

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
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);

    // Analytics
    Route::get('analytics/overview', [AnalyticsController::class, 'overview']);
    Route::get('analytics/products', [AnalyticsController::class, 'products']);
});


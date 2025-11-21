<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\StoreApprovalController;
use App\Http\Controllers\Api\Auth\Seller\SellerActivationController;
use App\Http\Controllers\Api\Auth\Seller\SellerAuthController;
use App\Http\Controllers\Api\Auth\Seller\SellerRegisterController;
use App\Http\Controllers\Api\Auth\Customer\CustomerAuthController;
use App\Http\Controllers\Api\Auth\Customer\CustomerRegisterController;
use App\Http\Controllers\Api\Auth\Customer\SocialLoginController;

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
    Route::post('dashboard', [DashboardController::class, 'index']);
    Route::get('sellers/pending', [StoreApprovalController::class, 'index']);
    Route::post('sellers/{store}/approve', [StoreApprovalController::class, 'approve']);
    Route::post('sellers/{store}/reject', [StoreApprovalController::class, 'reject']);
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::put('orders/{order}', [OrderController::class, 'update']);    
});

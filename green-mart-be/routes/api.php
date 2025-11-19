<?php

use App\Http\Controllers\Api\Admin\StoreApprovalController;
use App\Http\Controllers\Api\Auth\Seller\SellerActivationController;
use App\Http\Controllers\Api\Auth\Seller\SellerAuthController;
use App\Http\Controllers\Api\Auth\Seller\SellerRegisterController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('seller/register', [SellerRegisterController::class, 'register']);
    Route::post('seller/login', [SellerAuthController::class, 'login']);
    Route::post('seller/activate', [SellerActivationController::class, 'activate']);
});

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('sellers/pending', [StoreApprovalController::class, 'index']);
    Route::post('sellers/{store}/approve', [StoreApprovalController::class, 'approve']);
    Route::post('sellers/{store}/reject', [StoreApprovalController::class, 'reject']);
});


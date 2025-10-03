<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\store\ProductController;

// Authentication routes
Route::prefix('v1/auth')->group(function () {
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);
	Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
	Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
	Route::post('/reset-password', [AuthController::class, 'resetPassword']);
	Route::post('/google-login', [AuthController::class, 'googleLogin']);
	Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Nhóm cần đăng nhập
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
	// Store (yêu cầu đã đăng nhập; có thể thêm 'authSeller' nếu muốn chỉ seller được phép)
	Route::post('/stores', [StoreController::class, 'store']);
	Route::get('/stores/me', [StoreController::class, 'myStore']);

	// Product (bắt buộc seller)
	Route::post('/products', [ProductController::class, 'store'])->middleware('authSeller');
	Route::get('/products', [ProductController::class, 'index'])->middleware('authSeller');
});
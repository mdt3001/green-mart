<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Store\StoreController;


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

// API routes for user management
// Route::prefix('api/v1')->group(function () {
//     Route::post('/users', [UserController::class, 'createUser']);
//     Route::put('/users/{id}', [UserController::class, 'updateUser']);
//     Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
// });

// ...
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::post('/stores', [StoreController::class, 'store']);   // đăng ký cửa hàng
    Route::get('/stores/me', [StoreController::class, 'myStore']); // xem cửa hàng của mình
});
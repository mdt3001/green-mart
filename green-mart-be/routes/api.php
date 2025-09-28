<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

// API routes for user management
Route::prefix('api/v1')->group(function () {
    Route::post('/users', [UserController::class, 'createUser']);
    Route::put('/users/{id}', [UserController::class, 'updateUser']);
    Route::delete('/users/{id}', [UserController::class, 'deleteUser']);
});
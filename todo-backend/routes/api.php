<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TaskController;

// Public Routes (No token required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Token required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Get the current logged-in user profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);

    // Task CRUD endpoints
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('categories', CategoryController::class)->only(['index', 'store']);

    // Dashboard Stats Endpoint
    Route::get('/dashboard/stats', [TaskController::class, 'getDashboardStats']);
});

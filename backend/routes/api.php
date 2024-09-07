<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CorsMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware([CorsMiddleware::class])->group(function() {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user', [UserController::class, 'store']);

    Route::middleware('auth:sanctum')->group(function() {
        Route::prefix('tasks')->group(function(){
            Route::post('/index', [TaskController::class, 'index']);
            Route::post('/', [TaskController::class, 'store']);
            Route::get('/{id}', [TaskController::class, 'show']);
            Route::put('/{id}', [TaskController::class, 'update']);
            Route::delete('/{id}', [TaskController::class, 'destroy']);
        });
    });
});

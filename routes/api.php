<?php

use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\CalculationApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Authentication API
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthApiController::class, 'register'])->name('api.auth.register');
    Route::post('login', [AuthApiController::class, 'login'])->name('api.auth.login');

    Route::middleware('auth')->group(function () {
        Route::get('me', [AuthApiController::class, 'me'])->name('api.auth.me');
        Route::post('logout', [AuthApiController::class, 'logout'])->name('api.auth.logout');
    });
});

// Calculations API (Strictly protected by authentication)
Route::middleware('auth')->group(function () {
    Route::get('calculations', [CalculationApiController::class, 'index'])->name('api.calculations.index');
    Route::post('calculations', [CalculationApiController::class, 'store'])->name('api.calculations.store');
    Route::get('calculations/{calculation}', [CalculationApiController::class, 'show'])->name('api.calculations.show');
    Route::delete('calculations/{calculation}', [CalculationApiController::class, 'destroy'])->name('api.calculations.destroy');
});

<?php

use App\Http\Controllers\Api\InputEmissionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\DevicesController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/inputemission', [InputEmissionController::class, 'index']);

Route::post('/chat', [ChatbotController::class, 'reply']);
Route::apiResource('users', UserController::class);
Route::apiResource('devices', DevicesController::class);
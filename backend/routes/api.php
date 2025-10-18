<?php
use App\Http\Controllers\Api\InputEmissionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DevicesController;
use App\Http\Controllers\ChatbotController;

Route::get('/inputemission', [InputEmissionController::class, 'index']);


Route::post('/chat', [ChatbotController::class, 'reply']);
Route::apiResource('users', UserController::class);
Route::apiResource('devices', DevicesController::class);

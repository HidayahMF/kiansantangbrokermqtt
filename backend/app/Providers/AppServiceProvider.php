<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Tempat untuk mendaftarkan binding service atau konfigurasi tambahan.
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Jalankan hal-hal yang dibutuhkan ketika aplikasi bootstrap.
    }
}

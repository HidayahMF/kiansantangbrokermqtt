<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

$email = env('ADMIN_EMAIL');
$password = env('ADMIN_PASSWORD');

if (empty($email) || empty($password)) {
    throw new RuntimeException(
        'UserSeeder aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.'
    );
}

DB::table('users')->updateOrInsert(
    ['email' => $email],
    [
        'name' => 'Admin',
        'password' => bcrypt($password),
    ]
);

// Optional sample users. NOTE: update UserFactory below to populate every
// required column (nomer, kecamatan, kelurahan, kodepos) before enabling.
// User::factory(5)->create();

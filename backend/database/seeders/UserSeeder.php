<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $email = (string) env('ADMIN_EMAIL');
        $password = (string) env('ADMIN_PASSWORD');

        if ($email === '' || $password === '') {
            throw new \RuntimeException(
                'UserSeeder aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.'
            );
        }

        // The `users` table requires address columns for every record, so the
        // bootstrap Admin row receives neutral placeholder values for them.
        DB::table('users')->updateOrInsert(
            ['email' => $email],
            [
                'name' => 'Admin',
                'password' => bcrypt($password),
                'nomer' => 0,
                'kecamatan' => '-',
                'kelurahan' => '-',
                'kodepos' => 0,
            ]
        );
    }
}
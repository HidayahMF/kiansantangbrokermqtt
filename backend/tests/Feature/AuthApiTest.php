<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('registers a user and returns a JWT token', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'New User',
        'email' => 'new@example.com',
        'password' => 'secret123',
        'nomer' => 81234567,
        'kecamatan' => 'Coblong',
        'kelurahan' => 'Dago',
        'kodepos' => 40135,
    ]);

    $response
        ->assertStatus(201)
        ->assertJsonPath('message', 'Register success')
        ->assertJsonStructure(['token', 'user' => ['id', 'email']])
        ->assertJsonMissingPath('user.password');

    $this->assertDatabaseHas('users', ['email' => 'new@example.com']);
});

it('rejects registration with a duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->postJson('/api/register', [
        'name' => 'Someone',
        'email' => 'taken@example.com',
        'password' => 'secret123',
        'nomer' => 81234567,
        'kecamatan' => 'Coblong',
        'kelurahan' => 'Dago',
        'kodepos' => 40135,
    ])->assertStatus(422)->assertJsonValidationErrors(['email']);
});

it('logs in an existing user and returns a JWT token', function () {
    User::factory()->create([
        'email' => 'login@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'secret123',
    ])
        ->assertOk()
        ->assertJsonPath('message', 'Login success')
        ->assertJsonStructure(['token', 'user' => ['id', 'email']])
        ->assertJsonMissingPath('user.password');
});

it('returns 401 for invalid credentials', function () {
    User::factory()->create([
        'email' => 'login@example.com',
        'password' => Hash::make('secret123'),
    ]);

    $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'wrong-password',
    ])->assertStatus(401)->assertJsonPath('message', 'Invalid credentials');
});

it('validates login input', function () {
    $this->postJson('/api/login', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});
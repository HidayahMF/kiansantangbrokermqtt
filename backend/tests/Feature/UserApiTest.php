<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists all users', function () {
    User::factory()->create(['email' => 'first@example.com']);
    User::factory()->create(['email' => 'second@example.com']);

    $this->getJson('/api/users')
        ->assertOk()
        ->assertJsonCount(2);
});

it('creates a user and hides the password', function () {
    $response = $this->postJson('/api/users', [
        'name' => 'Dimas Prasetyo',
        'email' => 'dimas@example.com',
        'password' => 'secret123',
        'nomer' => 81234567,
        'kecamatan' => 'Coblong',
        'kelurahan' => 'Dago',
        'kodepos' => 40135,
    ]);

    $response
        ->assertStatus(201)
        ->assertJsonPath('email', 'dimas@example.com')
        ->assertJsonMissingPath('password');

    $this->assertDatabaseHas('users', ['email' => 'dimas@example.com']);
    $this->assertNotSame('secret123', User::where('email', 'dimas@example.com')->first()->password);
});

it('requires all fields when creating a user', function () {
    $this->postJson('/api/users', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password', 'nomer', 'kecamatan', 'kelurahan', 'kodepos']);
});

it('rejects a duplicate email when creating a user', function () {
    User::factory()->create(['email' => 'duplicate@example.com']);

    $this->postJson('/api/users', [
        'name' => 'Another User',
        'email' => 'duplicate@example.com',
        'password' => 'secret123',
        'nomer' => 81234567,
        'kecamatan' => 'Coblong',
        'kelurahan' => 'Dago',
        'kodepos' => 40135,
    ])->assertStatus(422)->assertJsonValidationErrors(['email']);
});

it('shows a single user', function () {
    $user = User::factory()->create();

    $this->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('id', $user->id)
        ->assertJsonMissingPath('password');
});

it('returns 404 for a missing user', function () {
    $this->getJson('/api/users/999')
        ->assertStatus(404)
        ->assertJsonPath('message', 'User not found');
});

it('updates a user and hashes the new password', function () {
    $user = User::factory()->create();

    $this->putJson("/api/users/{$user->id}", [
        'name' => 'Updated Name',
        'password' => 'newsecret123',
    ])
        ->assertOk()
        ->assertJsonPath('name', 'Updated Name');

    $fresh = User::find($user->id);
    $this->assertNotSame('newsecret123', $fresh->password);
    $this->assertTrue(Hash::check('newsecret123', $fresh->password));
});

it('allows updating a user via PATCH', function () {
    $user = User::factory()->create();

    $this->patchJson("/api/users/{$user->id}", ['name' => 'Patched'])
        ->assertOk()
        ->assertJsonPath('name', 'Patched');
});

it('rejects an email already used by another user on update', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->putJson("/api/users/{$user->id}", ['email' => $other->email])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

it('returns 404 when updating a missing user', function () {
    $this->putJson('/api/users/999', ['name' => 'Nobody'])
        ->assertStatus(404)
        ->assertJsonPath('message', 'User not found');
});

it('deletes a user', function () {
    $user = User::factory()->create();

    $this->deleteJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('message', 'User deleted successfully');

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

it('returns 404 when deleting a missing user', function () {
    $this->deleteJson('/api/users/999')
        ->assertStatus(404)
        ->assertJsonPath('message', 'User not found');
});
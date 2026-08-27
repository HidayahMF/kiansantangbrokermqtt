<?php

use App\Models\Devices;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists all devices', function () {
    Devices::factory()->count(2)->create();

    $this->getJson('/api/devices')
        ->assertOk()
        ->assertJsonCount(2);
});

it('creates a device', function () {
    $this->postJson('/api/devices', ['name' => 'Sensor Ruangan A'])
        ->assertStatus(201)
        ->assertJsonPath('name', 'Sensor Ruangan A');

    $this->assertDatabaseHas('devices', ['name' => 'Sensor Ruangan A']);
})->group('device-create');

it('requires a name when creating a device', function () {
    $this->postJson('/api/devices', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

it('shows a single device', function () {
    $device = Devices::factory()->create();

    $this->getJson("/api/devices/{$device->id}")
        ->assertOk()
        ->assertJsonPath('id', $device->id);
});

it('returns 404 for a missing device', function () {
    $this->getJson('/api/devices/999')->assertStatus(404);
});

it('updates a device', function () {
    $device = Devices::factory()->create();

    $this->putJson("/api/devices/{$device->id}", ['name' => 'Updated Sensor'])
        ->assertOk()
        ->assertJsonPath('name', 'Updated Sensor');
});

it('allows updating a device via PATCH', function () {
    $device = Devices::factory()->create();

    $this->patchJson("/api/devices/{$device->id}", ['name' => 'Patched Sensor'])
        ->assertOk()
        ->assertJsonPath('name', 'Patched Sensor');
});

it('returns 404 when updating a missing device', function () {
    $this->putJson('/api/devices/999', ['name' => 'Ghost'])
        ->assertStatus(404);
});

it('deletes a device', function () {
    $device = Devices::factory()->create();

    $this->deleteJson("/api/devices/{$device->id}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('devices', ['id' => $device->id]);
});

it('returns 404 when deleting a missing device', function () {
    $this->deleteJson('/api/devices/999')->assertStatus(404);
});
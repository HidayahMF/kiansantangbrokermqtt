<?php

use App\Models\InputEmission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns input-emission readings newest first', function () {
    InputEmission::create([
        'timestamp' => '2026-08-27 09:00:00',
        'voltage' => 220.0,
        'current' => 1.5,
        'CO2' => 120.5,
    ]);
    InputEmission::create([
        'timestamp' => '2026-08-27 10:00:00',
        'voltage' => 220.0,
        'current' => 1.6,
        'CO2' => 140.9,
    ]);

    $response = $this->getJson('/api/inputemission')
        ->assertOk()
        ->assertJsonCount(2);

    expect($response->json()[0]['timestamp'])->toBe('2026-08-27 10:00:00');
    expect($response->json()[1]['timestamp'])->toBe('2026-08-27 09:00:00');
});

it('returns an empty array when no readings exist', function () {
    $this->getJson('/api/inputemission')
        ->assertOk()
        ->assertJson([]);
});
<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns a matched reply from the dataset', function () {
    $this->postJson('/api/chat', ['message' => 'apa itu emisi karbon?'])
        ->assertOk()
        ->assertJsonPath('reply', 'Emisi karbon adalah gas CO₂ yang dilepaskan ke atmosfer akibat aktivitas manusia seperti kendaraan bermotor, industri, dan pembangkit listrik.');
});

it('returns the fallback reply when no keyword matches', function () {
    $this->postJson('/api/chat', ['message' => 'bagaimana cuaca hari ini?'])
        ->assertOk()
        ->assertJsonPath('reply', 'Maaf, aku belum tahu tentang itu 😅. Coba tanyakan tentang emisi karbon atau efek rumah kaca!');
});

it('matches keywords case-insensitively', function () {
    $this->postJson('/api/chat', ['message' => 'APA ITU EFEK RUMAH KACA'])
        ->assertOk()
        ->assertJsonPath('reply', 'Efek rumah kaca adalah proses alami yang menjaga suhu bumi tetap hangat. Tapi peningkatan gas rumah kaca menyebabkan pemanasan global.');
});

it('returns 503 when the dataset is unavailable', function () {
    config()->set('chatbot.dataset_path', storage_path('missing_chatbot_dataset.json'));

    $this->postJson('/api/chat', ['message' => 'halo'])
        ->assertStatus(503)
        ->assertJsonPath('message', 'Chatbot dataset is not available.');
});
<?php

use App\Console\Commands\MqttSubscribe;

it('decodes valid JSON payloads', function () {
    expect(MqttSubscribe::parsePayload('{"voltage":220}'))
        ->toBe(['voltage' => 220]);
});

it('keeps non-JSON payloads under a raw key', function () {
    expect(MqttSubscribe::parsePayload('not-json'))
        ->toBe(['raw' => 'not-json']);
});

it('decodes JSON values that are arrays', function () {
    expect(MqttSubscribe::parsePayload('["a","b"]'))
        ->toBe(['a', 'b']);
});

it('keeps malformed JSON under a raw key', function () {
    expect(MqttSubscribe::parsePayload('{broken'))
        ->toBe(['raw' => '{broken']);
});
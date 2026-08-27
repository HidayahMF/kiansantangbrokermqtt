<?php

return [
    /*
    |--------------------------------------------------------------------------
    | MQTT client configuration
    |--------------------------------------------------------------------------
    |
    | Settings used by the `php artisan mqtt:subscribe` command. All values are
    | environment-driven so that broker credentials never live in source code.
    |
    */

    'host' => env('MQTT_HOST', '127.0.0.1'),
    'port' => (int) env('MQTT_PORT', 1883),
    'client_id' => env('MQTT_CLIENT_ID', 'laravel_subscriber'),
    'topic' => env('MQTT_TOPIC', 'sensors/temperature'),
    'username' => env('MQTT_USER'),
    'password' => env('MQTT_PASS'),
    'keep_alive' => (int) env('MQTT_KEEP_ALIVE', 10),
];
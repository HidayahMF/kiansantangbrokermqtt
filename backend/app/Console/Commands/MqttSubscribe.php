<?php

namespace App\Console\Commands;

use App\Models\SensorReading;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use PhpMqtt\Client\ConnectionSettings;
use PhpMqtt\Client\MqttClient;

class MqttSubscribe extends Command
{
    protected $signature = 'mqtt:subscribe';
    protected $description = 'Subscribe to an MQTT topic and store incoming messages';

    public function handle(): int
    {
        $host = (string) config('mqtt.host');
        $port = (int) config('mqtt.port');
        $clientId = config('mqtt.client_id');
        $topic = (string) config('mqtt.topic');

        $this->info("Connecting to MQTT broker {$host}:{$port}");

        $mqtt = new MqttClient($host, $port, $clientId);

        $settings = (new ConnectionSettings())
            ->setUsername(config('mqtt.username'))
            ->setPassword(config('mqtt.password'))
            ->setKeepAliveInterval(config('mqtt.keep_alive'));

        try {
            $mqtt->connect($settings, true);
        } catch (\Exception $e) {
            $this->error("Couldn't connect: " . $e->getMessage());

            return 1;
        }

        $this->registerSubscriber($mqtt, $topic);
        $this->info("Connected. Subscribing to topic: {$topic}");
        $this->info('Entering loop, waiting for messages...');

        while (true) {
            try {
                $mqtt->loop(true);
                usleep(100000);
            } catch (\Exception $e) {
                $this->error('MQTT loop error: ' . $e->getMessage());
                sleep(2);

                $this->reconnect($mqtt, $topic);
            }
        }
    }

    private function registerSubscriber(MqttClient $mqtt, string $topic): void
    {
        $mqtt->subscribe($topic, function (string $topic, string $message, bool $retained) {
            $payload = self::parsePayload($message);
            $this->info("Received on {$topic}: {$message}");

            try {
                SensorReading::create([
                    'topic' => $topic,
                    'payload' => $payload,
                ]);
            } catch (\Throwable $ex) {
                Log::error('Failed saving MQTT message: ' . $ex->getMessage(), [
                    'topic' => $topic,
                    'payload' => $payload,
                ]);
            }
        }, 0);
    }

    private function reconnect(MqttClient $mqtt, string $topic): void
    {
        try {
            $mqtt->disconnect();
        } catch (\Throwable $t) {
            // ignore disconnect errors
        }

        try {
            $mqtt->connect($this->settings(), true);
            $this->registerSubscriber($mqtt, $topic);
            $this->info('Reconnected to MQTT broker.');
        } catch (\Exception $ex) {
            $this->error('Reconnect failed: ' . $ex->getMessage());
            sleep(5);
        }
    }

    private function settings(): ConnectionSettings
    {
        return (new ConnectionSettings())
            ->setUsername(config('mqtt.username'))
            ->setPassword(config('mqtt.password'))
            ->setKeepAliveInterval(config('mqtt.keep_alive'));
    }

    /**
     * Decode a raw MQTT message into an array. Valid JSON is decoded; anything
     * else is preserved under a `raw` key.
     */
    public static function parsePayload(string $message): array
    {
        $decoded = json_decode($message, true);

        return is_array($decoded) ? $decoded : ['raw' => $message];
    }
}
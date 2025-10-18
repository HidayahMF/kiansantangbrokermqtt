<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\Log;
use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;
use App\Models\SensorReading;

class MqttSubscribe extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:subscribe';
    protected $description = 'Subscribe to MQTT topic and store message';

    public function handle()
    {
        $host = config('mqtt.host', ENV('MQTT_HOST'));
        $port = config('mqtt.port', ENV('MQTT_PORT', 1883));
        $clientId = env('MQTT_CLIENT_ID', 'laravel_subscriber_' . uniqid());
        $topic = env('MQTT_TOPIC', 'sensors/temperature');

        $this->info('Connecting to MQTT broker {$host}:{$port}');

        $mqtt = new MqttClient($host, (int)$port, $clientId);

        $connectionSettings = (new ConnectionSettings())
            ->setUsername(env('MQTT_USER', null))
            ->setPassword(env('MQTT_PASS', null))
            ->setKeepAliveInterval(10);

        try {
            $mqtt->connect($connectionSettings, true);
        } catch (\Exception $e) {
            $this->error("Couldn't connect: " . $e->getMessage());
            return 1;
        }

        $this->info("Connected. Subscribing to topic: {$topic}");

        $mqtt->subscribe($topic, function (string $topic, string $message, bool $retained) {
            $this->info("Received on {$topic}: {$message}");


            try {
                SensorReading::create([
                    'topic'   => $topic,
                    'payload' => json_decode($message, true) ?? ['raw' => $message],
                ]);
            } catch (\Throwable $ex) {
                Log::error('Failed saving MQTT message: ' . $ex->getMessage());
            }
        }, 0);

        $this->info("Entering loop, waiting for messages...");
        while (true) {
            try {
                $mqtt->loop(true);
                usleep(100000);
            } catch (\Exception $e) {
                $this->error("MQTT loop error: " . $e->getMessage());
                sleep(2);

                try {
                    $mqtt->disconnect();
                } catch (\Throwable $t) {
                    // ignore
                }

                try {
                    $mqtt->connect($connectionSettings, true);
                    $mqtt->subscribe($topic, function (string $topic, string $message, bool $retained) {
                        $this->info("Received on {$topic}: {$message}");
                        try {
                            SensorReading::create([
                                'topic'   => $topic,
                                'payload' => json_decode($message, true) ?? ['raw' => $message],
                            ]);
                        } catch (\Throwable $ex) {
                            Log::error('Failed saving MQTT message: ' . $ex->getMessage());
                        }
                    }, 0);
                } catch (\Exception $ex) {
                    $this->error("Reconnect failed: " . $ex->getMessage());
                    sleep(5);
                }
            }
        }
    }
}

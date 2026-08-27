<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Devices>
 */
class DevicesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Sensor ' . ucfirst($this->faker->word()),
        ];
    }
}
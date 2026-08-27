<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorReading extends Model
{
    protected $fillable = [
        'topic',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InputEmission extends Model
{
    protected $table = 'inputemission';
    public $timestamps = false;

    protected $fillable = [
        'timestamp',
        'voltage',
        'current',
        'power',
        'energy',
        'frequency',
        'powerFactor',
        'tempAmbient',
        'tempObject',
        'CO2'
    ];
}

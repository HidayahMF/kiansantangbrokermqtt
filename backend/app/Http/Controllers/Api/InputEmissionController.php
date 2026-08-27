<?php

namespace App\Http\Controllers\Api;

use App\Models\InputEmission;

class InputEmissionController
{
    /**
     * Return all input-emission readings, newest first.
     */
    public function index()
    {
        return response()->json(InputEmission::orderBy('timestamp', 'desc')->get());
    }
}
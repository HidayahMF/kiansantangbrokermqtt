<?php

namespace App\Http\Controllers\Api;

use App\Models\InputEmission;
use Illuminate\Http\Request;

class InputEmissionController
{
    public function index()
    {
        return response()->json(InputEmission::orderBy('timestamp', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'timestamp' => 'required|date',
            'voltage' => 'required|numeric',
            'current' => 'required|numeric',
            'power' => 'nullable|numeric',
            'energy' => 'nullable|numeric',
            'frequency' => 'nullable|numeric',
            'powerFactor' => 'nullable|numeric',
            'tempAmbient' => 'nullable|numeric',
            'tempObject' => 'nullable|numeric',
            'CO2' => 'nullable|numeric',
        ]);

        $item = InputEmission::create($data);
        return response()->json($item, 201);
    }
}

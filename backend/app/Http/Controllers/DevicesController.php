<?php

namespace App\Http\Controllers;

use App\Models\Devices;
use Illuminate\Http\Request;

class DevicesController
{
    public function index()
    {
        return Devices::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        return Devices::create($validated);
    }

    public function show(Devices $device)
    {
        return $device;
    }

    public function update(Request $request, Devices $device)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $device->update($validated);
        return $device;
    }

    public function destroy(Devices $device)
    {
        $device->delete();
        return response()->noContent();
    }
}
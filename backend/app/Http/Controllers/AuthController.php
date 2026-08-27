<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController
{
    /**
     * Register a new user and return a JWT token.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'nomer' => 'required|numeric',
            'kecamatan' => 'required|string',
            'kelurahan' => 'required|string',
            'kodepos' => 'required|numeric',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'message' => 'Register success',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * Authenticate a user by email/password and return a JWT token.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $token = Auth::guard('api')->attempt($credentials);

        if (!$token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();

        return response()->json([
            'message' => 'Login success',
            'token' => $token,
            'user' => $user,
        ]);
    }
}
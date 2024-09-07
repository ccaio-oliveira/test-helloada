<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    protected $user;
    public function __construct()
    {
        $this->user = new User();
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = $this->user->where('email', $credentials['email'])->first();

        if(!$user){
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if(!Hash::check($credentials['password'], $user->password)){
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if(Auth::attempt($credentials, true)){
            $token = $request->user()->createToken('invoice')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    public function logout()
    {
        Auth::logout();
        Cookie::forget('laravel_session');
        Cookie::forget('XSRF-TOKEN');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function store(Request $request)
    {
        try {

            $check_email = $this->user::where('email', $request->email)->first();

            if($check_email){
                return response()->json([
                    'status' => 500,
                    'message' => 'Email already exists'
                ]);
            }

            DB::beginTransaction();

            $user = $this->user::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'User created successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);

        }
    }
}

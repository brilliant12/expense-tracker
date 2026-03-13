<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
   
 

      

    /**
     * User Login
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422));
        }

        $admin = Admin::where('email', $request->email)->first();
    
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create Sanctum token
        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user'  => $admin
            ]
        ]);
    }

    /**
     * User Logout
     */
    public function logout(Request $request)
    {
         if (!$request->user()) {
        return response()->json([
            'success' => false,
            'message' => 'User is not authenticated. Please log in.',
        ], 401); // Unauthorized
    }
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * User Dashboard (protected route)
     */
    public function dashboard(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Welcome to user dashboard',
            'data'    => $request->user()
        ]);
    }
}

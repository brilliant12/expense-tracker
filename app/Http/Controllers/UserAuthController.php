<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserAuthController extends Controller
{
    /**
     * User Registration
     */
    public function register(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

      if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),  // First error message
            ], 422);
        }

        if (DB::table('users')->where('email', $request->input('email'))->first()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors'  => 'Duplicate Email Already Exists'
        ], 422);
    }   

        // Create user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user', // default role
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'data'    => $user
        ], 201);
    }

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
        // Lookup location from IP
        $geo = Http::get("http://ip-api.com/json/{$request->ip()}")->json();
          if ($geo['status'] === 'fail' && $geo['message'] === 'reserved range') {
        $country = 'Localhost';
        $region  = 'Development';
        $city    = 'Testing';
    } else {
        $country = $geo['country'] ?? null;
        $region  = $geo['regionName'] ?? null;
        $city    = $geo['city'] ?? null;
    }
        DB::table('login_history')->insert([
            'user_id' => null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'status' => 'FAILURE',
            'failure_reason' => 'Validation failed',
            'country' => $country,
            'region'  => $region,
            'city'    => $city,
        ]);

        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors'  => $validator->errors()->first()
        ], 422));
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        $geo = Http::get("http://ip-api.com/json/{$request->ip()}")->json();
         if ($geo['status'] === 'fail' && $geo['message'] === 'reserved range') {
        $country = 'Localhost';
        $region  = 'Development';
        $city    = 'Testing';
    } else {
        $country = $geo['country'] ?? null;
        $region  = $geo['regionName'] ?? null;
        $city    = $geo['city'] ?? null;
    }
        DB::table('login_history')->insert([
            'user_id' => $user ? $user->id : null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'status' => 'FAILURE',
            'failure_reason' => 'Invalid credentials',
            'country' => $country,
            'region'  =>$region,
            'city'    => $city,
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    // Create Sanctum token
    $token = $user->createToken('user-token')->plainTextToken;

    $geo = Http::get("http://ip-api.com/json/{$request->ip()}")->json();
    // Log::info('api----------data :',$geo);

    if ($geo['status'] === 'fail' && $geo['message'] === 'reserved range') {
        $country = 'Localhost';
        $region  = 'Development';
        $city    = 'Testing';
    } else {
        $country = $geo['country'] ?? null;
        $region  = $geo['regionName'] ?? null;
        $city    = $geo['city'] ?? null;
    }


    DB::table('login_history')->insert([
        'user_id' => $user->id,
        'ip_address' => $request->ip(),
        'user_agent' => $request->header('User-Agent'),
        'status' => 'SUCCESS',
        'country' => $country,
        'region'  => $region,
        'city'    => $city,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'user'  => $user
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

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
class NewPasswordController extends Controller
{
    public function create($token)
    {
        return view('auth.reset-password', compact('token'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->update(['password' => bcrypt($password)]);
            }
        );

        return redirect('/login')->with('status', 'Password reset successful.');
    }
}

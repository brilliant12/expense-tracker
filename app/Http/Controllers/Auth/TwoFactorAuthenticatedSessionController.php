<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TwoFactorAuthenticatedSessionController extends Controller
{
    public function create()
    {
        return view('auth.two-factor-challenge');
    }

    public function store(Request $request)
    {
        $request->validate(['code' => 'required']);

        if ($request->code !== session('2fa_code')) {
            return back()->withErrors(['code' => 'Invalid authentication code']);
        }

        session()->forget('2fa_code');

        return redirect('/dashboard');
    }
}


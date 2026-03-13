<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->email), $hash)) {
            abort(403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect('/home');
    }
}


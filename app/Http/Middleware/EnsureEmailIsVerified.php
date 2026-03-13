<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && !$user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice')
                             ->with('status', 'You must verify your email before proceeding.');
        }

        return $next($request);
    }
}

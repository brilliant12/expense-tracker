<?php

use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    RegisteredUserController,
    PasswordResetLinkController,
    NewPasswordController,
    EmailVerificationPromptController,
    VerifyEmailController,
    EmailVerificationNotificationController,
    ConfirmablePasswordController,
    TwoFactorAuthenticatedSessionController
};
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function () {

    // Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    // Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/register', [RegisteredUserController::class, 'create']);
    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);

    Route::get('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'create']);
    Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Email verification notice
    Route::get('/email/verify', EmailVerificationPromptController::class)
        ->name('verification.notice'); // ✅ Add this

    // Email verification link
    Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Resend verification
    Route::post('/email/verification-notification',
        [EmailVerificationNotificationController::class, 'store']
    )->middleware('throttle:6,1')
     ->name('verification.send');

    Route::get('/user/confirm-password', [ConfirmablePasswordController::class, 'show']);
    Route::post('/user/confirm-password', [ConfirmablePasswordController::class, 'store']);
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])
    ->middleware(['auth', 'verified' ])
    ->name('home');


Route::any('/admin/{any}', function () { 
    return view('admin'); // loads resources/js/admin.jsx 
    })->where('any', '^(?!api).*');

Route::any('/{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*');

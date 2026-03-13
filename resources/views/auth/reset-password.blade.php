@extends('layouts.auth')

@section('title', 'Reset Password')
@section('heading', 'Reset Password')

@section('content')
<form method="POST" action="/reset-password">
    @csrf
    <input type="hidden" name="token" value="{{ $token }}">

    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email"
               name="email"
               class="form-control @error('email') is-invalid @enderror">
        @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">New Password</label>
        <input type="password"
               name="password"
               class="form-control @error('password') is-invalid @enderror">
        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input type="password"
               name="password_confirmation"
               class="form-control">
    </div>

    <div class="d-grid">
        <button class="btn btn-primary">Reset Password</button>
    </div>
</form>
@endsection

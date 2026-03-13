@extends('layouts.auth')

@section('title', 'Login')
@section('heading', 'Login')

@section('content')
<form method="POST" action="/login" class="needs-validation" novalidate>
    @csrf

    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email"
               name="email"
               value="{{ old('email') }}"
               class="form-control @error('email') is-invalid @enderror"
               required>
        @error('email')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password"
               name="password"
               class="form-control @error('password') is-invalid @enderror"
               required>
        @error('password')
            <div class="invalid-feedback">{{ $message }}</div>
        @enderror
    </div>

    <div class="mb-3 form-check">
        <input class="form-check-input" type="checkbox" name="remember">
        <label class="form-check-label">Remember me</label>
    </div>

    <div class="d-grid">
        <button class="btn btn-primary">Login</button>
    </div>

    <div class="text-center mt-3">
        <a href="/forgot-password">Forgot password?</a>
    </div>
</form>
@endsection

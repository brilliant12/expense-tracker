@extends('layouts.auth')

@section('title', 'Register')
@section('heading', 'Create Account')

@section('content')
<form method="POST" action="/register"  class="needs-validation" novalidate>
    @csrf

    <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text"
               name="name"
               value="{{ old('name') }}"
               class="form-control @error('name') is-invalid @enderror" required>
        @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email"
               name="email"
               value="{{ old('email') }}"
               class="form-control @error('email') is-invalid @enderror" required>
        @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password"
               name="password"
               class="form-control @error('password') is-invalid @enderror" required>
        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="mb-3">
        <label class="form-label">Confirm Password</label>
        <input type="password"
               name="password_confirmation"
               class="form-control" required>
    </div>

    <div class="d-grid">
        <button class="btn btn-success">Register</button>
    </div>
</form>
@endsection

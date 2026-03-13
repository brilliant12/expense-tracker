@extends('layouts.auth')

@section('title', 'Forgot Password')
@section('heading', 'Forgot Password')

@section('content')
<form method="POST" action="/forgot-password">
    @csrf

    <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email"
               name="email"
               class="form-control @error('email') is-invalid @enderror">
        @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="d-grid">
        <button class="btn btn-warning">Send Reset Link</button>
    </div>
</form>
@endsection

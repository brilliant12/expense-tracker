@extends('layouts.auth')

@section('title', 'Confirm Password')
@section('heading', 'Confirm Password')

@section('content')
<form method="POST" action="/user/confirm-password">
    @csrf

    <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password"
               name="password"
               class="form-control @error('password') is-invalid @enderror">
        @error('password') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="d-grid">
        <button class="btn btn-secondary">Confirm</button>
    </div>
</form>
@endsection

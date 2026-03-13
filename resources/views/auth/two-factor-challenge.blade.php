@extends('layouts.auth')

@section('title', 'Two Factor Authentication')
@section('heading', 'Two-Factor Authentication')

@section('content')
<form method="POST" action="/two-factor-challenge">
    @csrf

    <div class="mb-3">
        <label class="form-label">Authentication Code</label>
        <input type="text"
               name="code"
               class="form-control @error('code') is-invalid @enderror">
        @error('code') <div class="invalid-feedback">{{ $message }}</div> @enderror
    </div>

    <div class="d-grid">
        <button class="btn btn-dark">Verify</button>
    </div>
</form>
@endsection

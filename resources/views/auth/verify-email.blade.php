@extends('layouts.auth')

@section('title', 'Verify Email')
@section('heading', 'Verify Your Email')

@section('content')
<p class="text-muted mb-3">
    Please verify your email address by clicking the link sent to you.
</p>

<form method="POST" action="/email/verification-notification">
    @csrf
    <div class="d-grid mb-2">
        <button class="btn btn-info">Resend Verification Email</button>
    </div>
</form>

<form method="POST" action="/logout">
    @csrf
    <div class="d-grid">
        <button class="btn btn-outline-danger">Logout</button>
    </div>
</form>
@endsection

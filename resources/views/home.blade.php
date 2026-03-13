@extends('layouts.auth')

@section('title', 'Home')
@section('heading', 'Welcome to the Home Page')

@section('content')
<div class="text-center">
    <p class="lead">You are successfully logged in!</p>

    <div class="d-grid gap-2 mt-4">
        <a href="/logout" class="btn btn-danger"
           onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
            Logout
        </a>
    </div>

    <form id="logout-form" action="/logout" method="POST" class="d-none">
        @csrf
    </form>
</div>
@endsection

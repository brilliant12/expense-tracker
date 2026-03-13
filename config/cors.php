<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Allow both localhost:3000 (React dev server) and 127.0.0.1:8000 (Laravel/Vite)
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:8000',
        'http://localhost:8000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true for Sanctum SPA authentication
    'supports_credentials' => true,
];

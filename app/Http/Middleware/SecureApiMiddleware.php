<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\Exceptions\HttpResponseException;

class SecureApiMiddleware
{
    private $secret;

    public function __construct()
    {
        $this->secret = env('API_SECRET_KEY', 'MySuperSecretKey1234567890'); // fallback key
    }

    public function handle(Request $request, Closure $next)
{
    // --- DECRYPT INCOMING REQUEST ---
    if ($request->isMethod('post') || $request->isMethod('put')) {
        $encryptedPayload = $request->input('payload');
        $signature        = $request->input('signature');

        if (!$encryptedPayload) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Missing payload or signature'
            ], 400));
        }

        // Decrypt the payload
        $data = $this->decrypt($encryptedPayload);

        // Ensure the decrypted data is an array
        if (!is_array($data)) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Invalid encrypted payload'
            ], 400));
        }

        // Merge decrypted data into the request
        $request->merge($data);
    }

    // --- PROCESS REQUEST ---
    $response = $next($request);
    //return $response;

    // --- ENCRYPT OUTGOING RESPONSE ---
    $content = $response instanceof Response ? $response->getContent() : (string) $response;

    // Encrypt the content
    $encrypted = $this->encrypt($content);
    $signature = hash_hmac('sha256', $encrypted, $this->secret);

    // Return the encrypted response in the desired format
    return response()->json([
        'payload'   => $encrypted,
        'signature' => $signature
    ]);
}


    // --- Encrypt data ---
    protected function encrypt(string $data): string
    {
        $key = hex2bin(substr(hash('sha256', $this->secret), 0, 64)); // 32 bytes
        $iv  = hex2bin(substr(hash('sha256', $this->secret), 0, 32)); // 16 bytes

        return base64_encode(openssl_encrypt($data, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv));
    }

    // --- Decrypt data ---
    protected function decrypt(string $encrypted)
    {
        $key = hex2bin(substr(hash('sha256', $this->secret), 0, 64)); // 32 bytes
        $iv  = hex2bin(substr(hash('sha256', $this->secret), 0, 32)); // 16 bytes

        $decrypted = openssl_decrypt(base64_decode($encrypted), 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        $jsonDecoded = json_decode($decrypted, true);
        return $jsonDecoded ?? $decrypted;
    }
}

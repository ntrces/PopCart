<?php
/**
 * Dynamic CORS helper for network compatibility
 * Allows both localhost:5173 and network requests (e.g., 192.168.x.x:5173)
 */

function set_cors_headers() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Whitelist allowed origins
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost',
        'https://localhost:5173',
        'https://localhost:3000',
        'https://localhost',
    ];
    
    // Allow any 192.168.*.* origin (LAN development)
    if (preg_match('/^https?:\/\/192\.168(\.[\d]+){2}:\d+$/', $origin)) {
        $allowed_origins[] = $origin;
    }
    
    // Allow any 127.0.0.* origin (localhost variants)
    if (preg_match('/^https?:\/\/127\.0\.0\.[\d]+/', $origin)) {
        $allowed_origins[] = $origin;
    }
    
    // Set CORS headers if origin is allowed
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header("Access-Control-Allow-Credentials: true");
    }
    
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
}

// Call this in every API file before outputting JSON
set_cors_headers();
?>

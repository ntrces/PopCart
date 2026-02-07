<?php
// Secure session configuration
// Include this file at the top of any PHP file that needs sessions

// Prevent caching of authenticated pages (prevents back button after logout)
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if (session_status() === PHP_SESSION_NONE) {
    // Configure secure session cookie parameters
    session_set_cookie_params([
        'lifetime' => 0,             // Expire when browser closes
        'path' => '/',
        'domain' => '',              // Empty = current domain (works for localhost too)
        'secure' => false,           // Set to true in production with HTTPS
        'httponly' => true,          // Prevent JavaScript XSS access to session cookie
        'samesite' => 'Strict'       // Prevent CSRF attacks
    ]);
    
    // Start the session with a secure name
    session_name('POPCART_SESSION');
    session_start();
    
    // Regenerate session ID periodically to prevent session fixation
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } else if (time() - $_SESSION['created'] > 1800) {
        // Regenerate session ID every 30 minutes
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
}
?>

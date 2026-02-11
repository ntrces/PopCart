<?php
// Secure session configuration
// Include this file at the top of any PHP file that needs sessions

// Prevent caching of authenticated pages (prevents back button after logout)
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");

if (session_status() === PHP_SESSION_NONE) {
    // Auto-detect if HTTPS is enabled (secure only in production)
    $https_enabled = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    
    // Configure secure session cookie parameters
    // CRITICAL: lifetime => 0 means session cookie expires when browser closes
    session_set_cookie_params([
        'lifetime' => 0,             // Expire immediately when browser closes (session cookie)
        'path' => '/',
        'domain' => '',              // Empty = current domain (works for localhost and LAN IPs)
        'secure' => $https_enabled,  // true only on HTTPS; false on HTTP (for LAN/dev)
        'httponly' => true,          // Prevent JavaScript XSS access to session cookie
        'samesite' => 'Strict'       // Strict mode for maximum security - prevents CSRF attacks
    ]);
    
    // Configure session parameters for automatic cleanup
    // Sessions older than 24 hours are deleted by garbage collector
    ini_set('session.gc_maxlifetime', 86400);  // 24 hours
    ini_set('session.gc_probability', 1);       // Run GC on 1 in 1000 requests (aggressive)
    ini_set('session.gc_divisor', 100);         // Probability = 1/100
    
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

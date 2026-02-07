<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Prevent caching to stop back navigation after logout
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

require 'session_config.php';
require 'auth_helpers.php';

// Verify user is authenticated
require_auth();

// Return current session user info
echo json_encode([
    "success" => true,
    "user" => [
        "user_id" => get_session_user_id(),
        "email" => get_session_email(),
        "usertype" => get_session_usertype(),
        "source_table" => $_SESSION['source_table'] ?? null
    ]
]);
?>

<?php
require 'cors_config.php';
header("Content-Type: application/json");

// Prevent caching to stop back navigation after logout
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'session_config.php';
require 'db_connect.php';
require 'auth_helpers.php';

// Verify user is authenticated
require_auth();

// Get user_id and source_table from session
$user_id = get_session_user_id();
$source_table = $_SESSION['source_table'] ?? null;

// Fetch firstname from the appropriate table based on source_table
$firstname = null;
if ($source_table === 'admins') {
    $stmt = $conn->prepare("SELECT firstname FROM admins WHERE user_id = ? LIMIT 1");
} else {
    $stmt = $conn->prepare("SELECT firstname FROM users WHERE user_id = ? LIMIT 1");
}

if ($stmt) {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $firstname = $row['firstname'];
    }
    $stmt->close();
}

// Return current session user info
echo json_encode([
    "success" => true,
    "user" => [
        "user_id" => get_session_user_id(),
        "firstname" => $firstname,
        "email" => get_session_email(),
        "usertype" => get_session_usertype(),
        "source_table" => $_SESSION['source_table'] ?? null
    ]
]);

if (isset($conn)) {
    $conn->close();
}
?>

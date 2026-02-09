<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db_connect.php';
require 'session_config.php';
require 'log_utils.php';
require 'input_utils.php';

// Debug file setup
$log_file = __DIR__ . '/logout_debug.log';
$timestamp = "[" . date('Y-m-d H:i:s') . "] ";

if (!$conn || $conn->connect_error) {
    file_put_contents($log_file, $timestamp . "DB Connection Failed\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// 1. Resolve Identity
$data = read_json_input();
$user_id = null;
$user_role = null;

file_put_contents($log_file, $timestamp . "Request data: " . json_encode($data) . "\n", FILE_APPEND);
file_put_contents($log_file, $timestamp . "Session data - user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'not set') . ", usertype: " . (isset($_SESSION['usertype']) ? $_SESSION['usertype'] : 'not set') . "\n", FILE_APPEND);

// Priority 1: Request Body (Post Data)
if (!empty($data['user_id'])) {
    $user_id = (int)$data['user_id'];
    $user_role = isset($data['usertype']) ? $data['usertype'] : null;
    file_put_contents($log_file, $timestamp . "Using request body - user_id: $user_id, role: $user_role\n", FILE_APPEND);
} 
// Priority 2: Session Fallback
elseif (isset($_SESSION['user_id'])) {
    $user_id = (int)$_SESSION['user_id'];
    $user_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    file_put_contents($log_file, $timestamp . "Using session - user_id: $user_id, role: $user_role\n", FILE_APPEND);
}

// 2. Perform Logging
if ($user_id && $user_id > 0) {
    file_put_contents($log_file, $timestamp . "Calling log_action with user_id=$user_id, role='$user_role', action='Signed out'\n", FILE_APPEND);
    log_action($conn, $user_id, $user_role, "Signed out");
    file_put_contents($log_file, $timestamp . "log_action call completed\n", FILE_APPEND);
} else {
    file_put_contents($log_file, $timestamp . "SKIPPED LOGGING - user_id is invalid or zero\n", FILE_APPEND);
}

// 3. Cleanup Session
$_SESSION = [];
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}
session_destroy();

// 4. Response
echo json_encode([
    "success" => true, 
    "message" => "Logged out successfully",
    "logged_id" => $user_id
]);

if (isset($conn)) {
    $conn->close();
}
?>
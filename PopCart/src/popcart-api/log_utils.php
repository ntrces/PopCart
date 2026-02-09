<?php
require_once 'input_utils.php';

/**
 * Retrieves the role for a user by checking admin and user tables.
 */
function get_role_for_user($conn, int $user_id): ?string {
    $role = null;

    // 1. Check admins table first
    $stmt = $conn->prepare("SELECT usertype FROM admins WHERE user_id = ? LIMIT 1");
    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $role = $row['usertype'];
        }
        $stmt->close();
    }

    if ($role) return $role;

    // 2. Check users table second
    $stmt = $conn->prepare("SELECT usertype FROM users WHERE user_id = ? LIMIT 1");
    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $role = $row['usertype'];
        }
        $stmt->close();
    }

    return $role;
}

/**
 * Main logging function.
 * Updated to handle "Signed out" actions specifically.
 */
function log_action($conn, int $user_id, ?string $role, string $action): void {
    $debug_log = __DIR__ . '/logout_debug.log';
    $timestamp = "[" . date('Y-m-d H:i:s') . "] ";

    // Validation
    if (!$user_id || empty($action)) {
        file_put_contents($debug_log, $timestamp . "log_action: Missing ID or Action\n", FILE_APPEND);
        return;
    }

    // Lookup role if missing (common during logout if session is already cleared)
    if (empty($role)) {
        $role = get_role_for_user($conn, $user_id);
    }
    
    // Final fallback
    if (!$role) {
        $role = 'buyer'; 
    }

    // Sanitize
    $clean_role = sanitize_string($role, 20);
    $clean_action = sanitize_string($action, 255);
    
    // Critical: If sanitization returns null, use original values (truncated)
    if ($clean_role === null) {
        $clean_role = substr($role, 0, 20);
    }
    if ($clean_action === null) {
        $clean_action = substr($action, 0, 255);
    }

    file_put_contents($debug_log, $timestamp . "Sanitized - Role: '$clean_role', Action: '$clean_action'\n", FILE_APPEND);

    // Database Insertion
    $stmt = $conn->prepare("INSERT INTO logs (user_id, role, action) VALUES (?, ?, ?)");
    
    if ($stmt === false) {
        file_put_contents($debug_log, $timestamp . "SQL Prepare Error: " . $conn->error . "\n", FILE_APPEND);
        return;
    }

    $stmt->bind_param("iss", $user_id, $clean_role, $clean_action);
    
    file_put_contents($debug_log, $timestamp . "Executing INSERT with user_id=$user_id, role='$clean_role', action='$clean_action'\n", FILE_APPEND);
    
    if (!$stmt->execute()) {
        file_put_contents($debug_log, $timestamp . "SQL Execute Error: " . $stmt->error . "\n", FILE_APPEND);
        error_log("Execute failed in log_action: " . $stmt->error);
    } else {
        $insert_id = $conn->insert_id;
        file_put_contents($debug_log, $timestamp . "SUCCESS! Inserted log ID: $insert_id\n", FILE_APPEND);
    }

    $stmt->close();
}
?>
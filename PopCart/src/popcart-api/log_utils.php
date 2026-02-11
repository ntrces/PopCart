<?php
require_once 'input_utils.php';

/**
 * Retrieves the role for a user by checking admin and user tables.
 * Used as fallback when session data is not available (e.g., during logout).
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
 * Main logging function for recording user actions.
 * 
 * IMPORTANT: The $role parameter should be obtained from $_SESSION['usertype'] 
 * to ensure the logged usertype matches the user's actual role at the time of the action.
 * 
 * @param mysqli $conn Database connection
 * @param int $user_id The ID of the user performing the action
 * @param ?string $role The usertype/role of the user (should come from $_SESSION['usertype'])
 * @param string $action Description of the action performed
 * 
 * This function will:
 * 1. Use the provided $role if available (from session)
 * 2. Fall back to looking up role in database if $role is not provided
 * 3. Record the action with the user_id, role, and action in the logs table
 */
function log_action($conn, int $user_id, ?string $role, string $action): void {
    $debug_log = __DIR__ . '/logout_debug.log';
    $timestamp = "[" . date('Y-m-d H:i:s') . "] ";

    // Validation
    if (!$user_id || empty($action)) {
        file_put_contents($debug_log, $timestamp . "log_action: Missing ID or Action\n", FILE_APPEND);
        return;
    }

    // Lookup role if missing (fallback for cases where session data is unavailable)
    if (empty($role)) {
        // This fallback is mainly needed during logout when session is being destroyed
        $role = get_role_for_user($conn, $user_id);
        
        if ($role) {
            file_put_contents($debug_log, $timestamp . "log_action: Role looked up from database - user_id=$user_id, role='$role'\n", FILE_APPEND);
        }
    }
    
    // Final fallback
    if (!$role) {
        $role = 'buyer';  // Default to 'buyer' if role cannot be determined
        file_put_contents($debug_log, $timestamp . "log_action: Warning - Role could not be determined, defaulting to 'buyer' for user_id=$user_id\n", FILE_APPEND);
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

    file_put_contents($debug_log, $timestamp . "log_action: Recording - user_id=$user_id, role='$clean_role', action='$clean_action'\n", FILE_APPEND);

    // Database Insertion
    $stmt = $conn->prepare("INSERT INTO logs (user_id, role, action) VALUES (?, ?, ?)");
    
    if ($stmt === false) {
        file_put_contents($debug_log, $timestamp . "SQL Prepare Error: " . $conn->error . "\n", FILE_APPEND);
        return;
    }

    $stmt->bind_param("iss", $user_id, $clean_role, $clean_action);
    
    if (!$stmt->execute()) {
        file_put_contents($debug_log, $timestamp . "SQL Execute Error: " . $stmt->error . "\n", FILE_APPEND);
        error_log("Execute failed in log_action: " . $stmt->error);
    } else {
        $insert_id = $conn->insert_id;
        file_put_contents($debug_log, $timestamp . "log_action: SUCCESS! Inserted log ID=$insert_id for user_id=$user_id\n", FILE_APPEND);
    }

    $stmt->close();
}
?>
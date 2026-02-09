<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Prevent caching to stop back navigation after logout
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

require 'db_connect.php';

// Include secure session configuration
require 'session_config.php';
// Include password utility functions for secure verification
require 'password_utils.php';
require 'input_utils.php';
require 'log_utils.php';

// Get JSON input
$data = read_json_input();
$email_error = null;
$email = validate_email($data["email"] ?? "", $email_error);
$password = $data["password"] ?? "";  // Don't validate password length during login - only check if provided

// Check for brute force attack and apply exponential backoff delay
$brute_force_delay = get_brute_force_delay($conn);
if ($brute_force_delay > 0) {
    sleep($brute_force_delay);  // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s max
}

if (!$email || empty($password)) {
    record_failed_login_attempt();
    // Don't expose password requirements (8-12 characters) - use generic message
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    $conn->close();
    exit;
}

$user = null;
$found = false;

// Only check the admins table with usertype='admin'
$stmt = $conn->prepare("SELECT * FROM admins WHERE email = ? AND (usertype = 'admin' OR usertype = 'SuperAdmin')");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $found = true;
}
$stmt->close();

// If user found and is an admin, verify password
if ($found && $user) {
    if ($user["status"] === "inactive") {
        echo json_encode(["success" => false, "message" => "Your Account has been deactivated"]);
        $conn->close();
        exit;
    }

    // Verify hashed password using secure verification function
    // Works with both ARGON2ID and BCRYPT hashes for backward compatibility
    if (verifyPassword($password, $user["password"])) {
        // Reset login attempts on successful login
        $resetStmt = $conn->prepare("UPDATE admins SET login_attempt = 0 WHERE user_id = ?");
        $resetStmt->bind_param("i", $user["user_id"]);
        $resetStmt->execute();
        $resetStmt->close();

        // Store user data in secure session
        $_SESSION['user_id'] = $user["user_id"];
        $_SESSION['usertype'] = $user["usertype"];
        $_SESSION['email'] = $user["email"];
        $_SESSION['source_table'] = 'admins';
        $_SESSION['authenticated'] = true;

        log_action($conn, (int)$user["user_id"], $user["usertype"], "Logged in");

        reset_login_attempts();  // Clear failed attempt counter on successful login

        echo json_encode([
            "success" => true,
            "usertype" => $user["usertype"],
            "user" => [
                "user_id" => $user["user_id"],
                "firstname" => $user["firstname"],
                "lastname" => $user["lastname"],
                "email" => $user["email"],
                "usertype" => $user["usertype"],
                "status" => $user["status"],
                "source_table" => "admins"
            ]
        ]);
    } else {
        record_failed_login_attempt();  // Record for brute force detection
        
        $currentAttempts = isset($user["login_attempt"]) ? (int)$user["login_attempt"] : 0;
        $newAttempts = $currentAttempts + 1;

        if ($newAttempts >= 3) {
            $deactivateStmt = $conn->prepare("UPDATE admins SET status = 'inactive', login_attempt = 0 WHERE user_id = ?");
            $deactivateStmt->bind_param("i", $user["user_id"]);
            $deactivateStmt->execute();
            $deactivateStmt->close();

            // Log the account deactivation
            log_action($conn, (int)$user["user_id"], $user["usertype"], "Account deactivated due to 3 failed login attempts");

            echo json_encode(["success" => false, "message" => "Your Account has been deactivated"]);
        } else {
            $updateStmt = $conn->prepare("UPDATE admins SET login_attempt = ? WHERE user_id = ?");
            $updateStmt->bind_param("ii", $newAttempts, $user["user_id"]);
            $updateStmt->execute();
            $updateStmt->close();

            if ($newAttempts === 2) {
                echo json_encode(["success" => false, "message" => "2 Failed login. Enter the correct password to avoid deactivation"]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid email or password"]);
            }
        }
    }
} else {
    record_failed_login_attempt();  // Record for brute force detection
    
    echo json_encode(["success" => false, "message" => "Invalid credentials. Admin account required."]);
}

$conn->close();
?>

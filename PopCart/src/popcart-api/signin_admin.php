<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

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

// Get JSON input
$data = read_json_input();
$error = null;
$email = validate_email($data["email"] ?? "", $error);
$password = validate_password_length($data["password"] ?? "", $error);

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => $error ?? "Invalid credentials"]);
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
        $currentAttempts = isset($user["login_attempt"]) ? (int)$user["login_attempt"] : 0;
        $newAttempts = $currentAttempts + 1;

        if ($newAttempts >= 3) {
            $deactivateStmt = $conn->prepare("UPDATE admins SET status = 'inactive', login_attempt = 0 WHERE user_id = ?");
            $deactivateStmt->bind_param("i", $user["user_id"]);
            $deactivateStmt->execute();
            $deactivateStmt->close();

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
    echo json_encode(["success" => false, "message" => "Invalid credentials. Admin account required."]);
}

$conn->close();
?>

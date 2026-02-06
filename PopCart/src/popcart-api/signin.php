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

// Include secure session configuration
require 'session_config.php';
// Include password utility functions for secure verification
require 'password_utils.php';
require 'input_utils.php';

$servername = "localhost";
$username   = "root"; // default XAMPP user
$password   = "";     // default XAMPP password is empty
$dbname     = "popcart";

// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit;
}

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
$source_table = "";

// First, check the users table
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $found = true;
    $source_table = "users";
}
$stmt->close();

// If not found in users table, check the admins table
if (!$found) {
    $stmt = $conn->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $found = true;
        $source_table = "admins";
    }
    $stmt->close();
}

// If user found in either table, verify password
if ($found && $user) {
    // If user is from users table, handle login_attempt and status checks
    if ($source_table === "users") {
        if ($user["status"] === "inactive") {
            echo json_encode(["success" => false, "message" => "Your Account has been deactivated"]);
            $conn->close();
            exit;
        }
    }

    // Verify hashed password using secure verification function
    // Works with both ARGON2ID and BCRYPT hashes for backward compatibility
    if (verifyPassword($password, $user["password"])) {
        // Reset login attempts on successful login (users table only)
        if ($source_table === "users") {
            $resetStmt = $conn->prepare("UPDATE users SET login_attempt = 0 WHERE user_id = ?");
            $resetStmt->bind_param("i", $user["user_id"]);
            $resetStmt->execute();
            $resetStmt->close();
        }

        // Store user data in secure session
        $_SESSION['user_id'] = $user["user_id"];
        $_SESSION['usertype'] = $user["usertype"];
        $_SESSION['email'] = $user["email"];
        $_SESSION['source_table'] = $source_table;
        $_SESSION['authenticated'] = true;

        echo json_encode([
            "success" => true,
            "usertype" => $user["usertype"], // return usertype for React routing
            "user" => [
                "user_id" => $user["user_id"],
                "firstname" => $user["firstname"],
                "lastname" => $user["lastname"],
                "email" => $user["email"],
                "usertype" => $user["usertype"],
                "status" => $user["status"],
                "source_table" => $source_table
            ]
        ]);
    } else {
        // Handle failed login attempts for users table only
        if ($source_table === "users") {
            $currentAttempts = isset($user["login_attempt"]) ? (int)$user["login_attempt"] : 0;
            $newAttempts = $currentAttempts + 1;

            if ($newAttempts >= 3) {
                $deactivateStmt = $conn->prepare("UPDATE users SET status = 'inactive', login_attempt = 0 WHERE user_id = ?");
                $deactivateStmt->bind_param("i", $user["user_id"]);
                $deactivateStmt->execute();
                $deactivateStmt->close();

                echo json_encode(["success" => false, "message" => "Your Account has been deactivated"]);
            } else {
                $updateStmt = $conn->prepare("UPDATE users SET login_attempt = ? WHERE user_id = ?");
                $updateStmt->bind_param("ii", $newAttempts, $user["user_id"]);
                $updateStmt->execute();
                $updateStmt->close();

                if ($newAttempts === 2) {
                    echo json_encode(["success" => false, "message" => "2 Failed login. Enter the correct password to avoid deactivation"]);
                } else {
                    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
                }
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "User not registered"]);
}

$conn->close();
?>

<?php
require 'cors_config.php';
header("Content-Type: application/json");

// Prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include secure session configuration
require 'session_config.php';
// Include password utility functions for secure hashing
require 'password_utils.php';
require 'input_utils.php';
require 'log_utils.php';
require 'db_connect.php';

// Check database connection
if (!$conn || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get JSON from React
$data = read_json_input();

$lastname = sanitize_text($data["lastName"] ?? '', 100);
$firstname = sanitize_text($data["firstName"] ?? '', 100);
$error = null;
$email_error = null;
$password_error = null;
$email = validate_email($data["email"] ?? '', $email_error);
$birthday = sanitize_string($data["birthday"] ?? '', 10);
$contact_number = sanitize_string($data["contactNumber"] ?? '', 30);
$plainPassword = validate_password_length($data["password"] ?? '', $password_error);

if (!$lastname || !$firstname || !$email || !$plainPassword) {
    // Show specific password requirement error during signup
    if (!$plainPassword && $password_error) {
        echo json_encode(["success" => false, "message" => "Password should have 8-12 characters"]);
    } else {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
    }
    $conn->close();
    exit;
}

// Hash password using ARGON2ID for enhanced security
$hashedPassword = hashPassword($plainPassword);

// Check if email already exists in users table
$checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkResult = $checkEmail->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "This email has already been used"]);
    exit;
}
$checkEmail->close();

// Check if email already exists in admins table
$checkAdminEmail = $conn->prepare("SELECT * FROM admins WHERE email = ?");
$checkAdminEmail->bind_param("s", $email);
$checkAdminEmail->execute();
$checkAdminResult = $checkAdminEmail->get_result();

if ($checkAdminResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "This email has already been used"]);
    exit;
}
$checkAdminEmail->close();

// Insert new user with securely hashed password
$stmt = $conn->prepare(
    "INSERT INTO users (lastname, firstname, email, birthday, contact_number, password, usertype, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'buyer', 'active')"
);

$stmt->bind_param("ssssss", $lastname, $firstname, $email, $birthday, $contact_number, $hashedPassword);

if ($stmt->execute()) {
    $new_user_id = (int)$conn->insert_id;
    if ($new_user_id) {
        // Log the signup action
        log_action($conn, $new_user_id, 'buyer', "Signed up");
    }
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    // Check for unique constraint violation (email already exists)
    if ($conn->errno === 1062) {
        echo json_encode(["success" => false, "message" => "This email has already been used"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
}

$conn->close();
?>

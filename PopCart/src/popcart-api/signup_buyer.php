<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Include password utility functions for secure hashing
require 'password_utils.php';
require 'input_utils.php';

$servername = "localhost";
$username = "root";  // XAMPP default
$password = "";      // XAMPP default
$dbname = "popcart";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed."]));
}

// Get JSON from React
$data = read_json_input();

$lastname = sanitize_text($data["lastName"] ?? '', 100);
$firstname = sanitize_text($data["firstName"] ?? '', 100);
$error = null;
$email = validate_email($data["email"] ?? '', $error);
$birthday = sanitize_string($data["birthday"] ?? '', 10);
$contact_number = sanitize_string($data["contactNumber"] ?? '', 30);
$plainPassword = validate_password_length($data["password"] ?? '', $error);

if (!$lastname || !$firstname || !$email || !$plainPassword) {
    echo json_encode(["success" => false, "message" => $error ?? "All fields are required."]);
    $conn->close();
    exit;
}

// Hash password using ARGON2ID for enhanced security
$hashedPassword = hashPassword($plainPassword);

// Check if email already exists
$checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkResult = $checkEmail->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit;
}

// Insert new user with securely hashed password
$stmt = $conn->prepare(
    "INSERT INTO users (lastname, firstname, email, birthday, contact_number, password, usertype, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'buyer', 'active')"
);

$stmt->bind_param("ssssss", $lastname, $firstname, $email, $birthday, $contact_number, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error."]);
}

$conn->close();
?>

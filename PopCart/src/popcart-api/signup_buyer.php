<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";  // XAMPP default
$password = "";      // XAMPP default
$dbname = "popcart";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed."]));
}

// Get JSON from React
$data = json_decode(file_get_contents("php://input"), true);

$lastname = $data["lastName"];
$firstname = $data["firstName"];
$email = $data["email"];
$birthday = $data["birthday"];
$contact_number = $data["contactNumber"] ?? '';
$password = password_hash($data["password"], PASSWORD_DEFAULT);

// Check if email already exists
$checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$checkResult = $checkEmail->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit;
}

// Insert new user
$stmt = $conn->prepare(
    "INSERT INTO users (lastname, firstname, email, birthday, contact_number, password, usertype, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'buyer', 'active')"
);

$stmt->bind_param("ssssss", $lastname, $firstname, $email, $birthday, $contact_number, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database error."]);
}

$conn->close();
?>

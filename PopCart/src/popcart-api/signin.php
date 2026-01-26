<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

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
$data = json_decode(file_get_contents("php://input"), true);
$email    = $data["email"] ?? "";
$password = $data["password"] ?? "";

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
    // Verify hashed password
    if (password_verify($password, $user["password"])) {
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
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not registered"]);
}

$conn->close();
?>

<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email    = $data["email"] ?? "";
$password = $data["password"] ?? "";

$user = null;
$found = false;

// Only check the admins table with usertype='admin'
$stmt = $conn->prepare("SELECT * FROM admins WHERE email = ? AND usertype = 'admin'");
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
    // Verify hashed password
    if (password_verify($password, $user["password"])) {
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
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials. Admin account required."]);
}

$conn->close();
?>

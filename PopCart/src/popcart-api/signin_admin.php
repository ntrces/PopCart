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

    // Verify hashed password
    if (password_verify($password, $user["password"])) {
        // Reset login attempts on successful login
        $resetStmt = $conn->prepare("UPDATE admins SET login_attempt = 0 WHERE user_id = ?");
        $resetStmt->bind_param("i", $user["user_id"]);
        $resetStmt->execute();
        $resetStmt->close();

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

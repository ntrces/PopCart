<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['usertype'])) {
        // Admin edit usertype
        $user_id = $_POST['user_id'];
        $usertype = $_POST['usertype'];

        if (!in_array($usertype, ['buyer', 'employee', 'admin'])) {
            echo json_encode(["success" => false, "message" => "Invalid user type"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET usertype = ? WHERE user_id = ?");
        $stmt->bind_param("si", $usertype, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User role updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating user role"]);
        }

        $stmt->close();
    } else {
        // Profile update (JSON)
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $data['user_id'] ?? '';
        $lastname = $data['lastname'] ?? '';
        $firstname = $data['firstname'] ?? '';
        $birthday = $data['birthday'] ?? '';
        $contact_number = $data['contact_number'] ?? '';

        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User ID required"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET lastname = ?, firstname = ?, birthday = ?, contact_number = ? WHERE user_id = ?");
        $stmt->bind_param("ssssi", $lastname, $firstname, $birthday, $contact_number, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating profile"]);
        }

        $stmt->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

$conn->close();
?>
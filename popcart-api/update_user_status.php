<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$user_id = $_POST['user_id'] ?? '';
$status = $_POST['status'] ?? '';

if (!$user_id || !$status) {
    echo json_encode(["success" => false, "message" => "User ID and status required"]);
    exit;
}

if (!in_array($status, ['active', 'inactive'])) {
    echo json_encode(["success" => false, "message" => "Invalid status"]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
$stmt->bind_param("si", $status, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating user status"]);
}

$stmt->close();
$conn->close();
?>
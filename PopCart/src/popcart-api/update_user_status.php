<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';

$user_id = validate_int($_POST['user_id'] ?? null, 1);
$status = validate_enum($_POST['status'] ?? '', ['active', 'inactive']);
$source_table = validate_enum($_POST['source_table'] ?? 'users', ['users', 'admins']);

if (!$user_id || !$status) {
    echo json_encode(["success" => false, "message" => "User ID and status required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE $source_table SET status = ? WHERE user_id = ?");
$stmt->bind_param("si", $status, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating user status"]);
}

$stmt->close();
$conn->close();
?>
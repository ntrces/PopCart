<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$shipping_address_id = $data['shipping_address_id'] ?? '';
$user_id = $data['user_id'] ?? '';

if (!$shipping_address_id || !$user_id) {
    echo json_encode(["success" => false, "message" => "Address ID and User ID required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM shipping_address WHERE shipping_address_id = ? AND user_id = ?");
$stmt->bind_param("ii", $shipping_address_id, $user_id);

if ($stmt->execute()) {
    // Check if the deleted address was default
    $check_stmt = $conn->prepare("SELECT status FROM shipping_address WHERE shipping_address_id = ?");
    $check_stmt->bind_param("i", $shipping_address_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if ($row['status'] === 'default') {
            // Set shipping_id to null in users
            $update_user_stmt = $conn->prepare("UPDATE users SET shipping_id = NULL WHERE user_id = ?");
            $update_user_stmt->bind_param("i", $user_id);
            $update_user_stmt->execute();
            $update_user_stmt->close();
        }
    }
    $check_stmt->close();
    echo json_encode(["success" => true, "message" => "Address deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting address"]);
}

$stmt->close();
$conn->close();
?>
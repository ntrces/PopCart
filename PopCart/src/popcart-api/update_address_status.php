<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$shipping_address_id = $data['shipping_address_id'] ?? '';

if (!$user_id || !$shipping_address_id) {
    echo json_encode(["success" => false, "message" => "User ID and Address ID required"]);
    exit;
}

// Set all addresses for user to 'others'
$update_all_stmt = $conn->prepare("UPDATE shipping_address SET status = 'others' WHERE user_id = ? AND active_status = 'active'");
$update_all_stmt->bind_param("i", $user_id);
$update_all_stmt->execute();
$update_all_stmt->close();

// Set the specific address to 'default'
$update_stmt = $conn->prepare("UPDATE shipping_address SET status = 'default' WHERE shipping_address_id = ? AND user_id = ? AND active_status = 'active'");
$update_stmt->bind_param("ii", $shipping_address_id, $user_id);

if ($update_stmt->execute()) {
    // Update users table with the new default address
    $update_user_stmt = $conn->prepare("UPDATE users SET shipping_id = ? WHERE user_id = ?");
    $update_user_stmt->bind_param("ii", $shipping_address_id, $user_id);
    $update_user_stmt->execute();
    $update_user_stmt->close();
    echo json_encode(["success" => true, "message" => "Address set as default"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating address"]);
}

$update_stmt->close();
$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';
require 'log_utils.php';

$data = read_json_input();
$shipping_address_id = validate_int($data['shipping_address_id'] ?? null, 1);
$user_id = validate_int($data['user_id'] ?? null, 1);

if (!$shipping_address_id || !$user_id) {
    echo json_encode(["success" => false, "message" => "Address ID and User ID required"]);
    exit;
}

$stmt = $conn->prepare("UPDATE shipping_address SET active_status = 'inactive' WHERE shipping_address_id = ? AND user_id = ? AND active_status = 'active'");
$stmt->bind_param("ii", $shipping_address_id, $user_id);

if ($stmt->execute()) {
    // Check if the address was default
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
    log_action($conn, $user_id, null, "Removed shipping address {$shipping_address_id}");
    echo json_encode(["success" => true, "message" => "Address deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error deleting address"]);
}

$stmt->close();
$conn->close();
?>
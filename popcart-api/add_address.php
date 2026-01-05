<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$address_label = $data['address_label'] ?? '';
$postal_code = $data['postal_code'] ?? '';
$street_address = $data['street_address'] ?? '';
$city_municipality = $data['city_municipality'] ?? '';
$province = $data['province'] ?? '';
$is_default = $data['is_default'] ?? false;

if (!$user_id || !$address_label || !$postal_code || !$street_address || !$city_municipality || !$province) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

// Check if user has any addresses
$check_stmt = $conn->prepare("SELECT COUNT(*) as count FROM shipping_address WHERE user_id = ?");
$check_stmt->bind_param("i", $user_id);
$check_stmt->execute();
$result = $check_stmt->get_result();
$row = $result->fetch_assoc();
$has_addresses = $row['count'] > 0;
$check_stmt->close();

$status = (!$has_addresses) ? 'default' : ($is_default ? 'default' : 'others');

// If setting as default, update all existing to 'others'
if ($status === 'default') {
    $update_stmt = $conn->prepare("UPDATE shipping_address SET status = 'others' WHERE user_id = ?");
    $update_stmt->bind_param("i", $user_id);
    $update_stmt->execute();
    $update_stmt->close();
}

$stmt = $conn->prepare("INSERT INTO shipping_address (user_id, address_label, postal_code, street_address, city_municipality, province, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("issssss", $user_id, $address_label, $postal_code, $street_address, $city_municipality, $province, $status);

if ($stmt->execute()) {
    $new_address_id = $conn->insert_id;
    // If this is the default, update users table
    if ($status === 'default') {
        $update_user_stmt = $conn->prepare("UPDATE users SET shipping_id = ? WHERE user_id = ?");
        $update_user_stmt->bind_param("ii", $new_address_id, $user_id);
        $update_user_stmt->execute();
        $update_user_stmt->close();
    }
    echo json_encode(["success" => true, "message" => "Address added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error adding address"]);
}

$stmt->close();
$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';

$data = read_json_input();
$user_id = validate_int($data['user_id'] ?? null, 1);
$address_label = sanitize_text($data['address_label'] ?? '', 100);
$postal_code = sanitize_string($data['postal_code'] ?? '', 20);
$street_address = sanitize_text($data['street_address'] ?? '', 200);
$city_municipality = sanitize_text($data['city_municipality'] ?? '', 120);
$province = sanitize_text($data['province'] ?? '', 120);
$is_default = isset($data['is_default']) ? (bool)$data['is_default'] : false;

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

$stmt = $conn->prepare("INSERT INTO shipping_address (user_id, address_label, postal_code, street_address, city_municipality, province, status, active_status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')");
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
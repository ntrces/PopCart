<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';

$user_id = validate_int($_GET['user_id'] ?? null, 1);

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "Valid User ID required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM shipping_address WHERE user_id = ? AND active_status = 'active' ORDER BY CASE WHEN status = 'default' THEN 0 ELSE 1 END, shipping_address_id ASC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$addresses = [];
while ($row = $result->fetch_assoc()) {
    $addresses[] = $row;
}

echo json_encode(["success" => true, "addresses" => $addresses]);

$stmt->close();
$conn->close();
?>
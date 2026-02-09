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

$stmt = $conn->prepare("SELECT user_id, firstname, lastname, email, birthday, contact_number, shipping_id, usertype, status FROM users WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
$conn->close();
?>
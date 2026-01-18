<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

$sql = "SELECT COUNT(*) as total_users FROM users";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(["success" => true, "total_users" => $row['total_users']]);
} else {
    echo json_encode(["success" => false, "message" => "Query failed"]);
}

$conn->close();
?>
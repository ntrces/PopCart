<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

// Get the first admin from admins table with usertype='admin' and status='active'
$sql = "SELECT user_id, firstname, lastname, email FROM admins 
        WHERE usertype = 'admin' AND status = 'active' 
        ORDER BY user_id ASC 
        LIMIT 1";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $firstAdmin = $result->fetch_assoc();
    $firstAdmin['source_table'] = 'admins'; // Add source_table for consistency
    echo json_encode(["success" => true, "firstAdmin" => $firstAdmin]);
} else {
    echo json_encode(["success" => false, "message" => "No first admin found"]);
}

$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

// Get users from both users and admins tables
$users = [];

// Fetch from users table (only active users)
$sql1 = "SELECT user_id, firstname, lastname, email, usertype, status, 'users' as source_table 
         FROM users WHERE status = 'active'";
$result1 = $conn->query($sql1);

if ($result1) {
    while ($row = $result1->fetch_assoc()) {
        $users[] = $row;
    }
}

// Fetch from admins table (includes both 'admin' and 'SuperAdmin' usertypes, only active)
$sql2 = "SELECT user_id, firstname, lastname, email, usertype, status, 'admins' as source_table 
         FROM admins WHERE status = 'active'";
$result2 = $conn->query($sql2);

if ($result2) {
    while ($row = $result2->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode(["success" => true, "users" => $users]);

$conn->close();
?>
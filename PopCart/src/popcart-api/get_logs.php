<?php
require 'cors_config.php';
require 'db_connect.php';

header('Content-Type: application/json');

if (!$conn || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$query = "SELECT id, user_id, role, action, timestamp FROM logs ORDER BY timestamp ASC";
$result = $conn->query($query);

if ($result === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Query failed."]); 
    $conn->close();
    exit();
}

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = [
        "id" => (int)$row["id"],
        "user_id" => (int)$row["user_id"],
        "role" => $row["role"],
        "action" => $row["action"],
        "timestamp" => $row["timestamp"]
    ];
}

echo json_encode([
    "success" => true,
    "logs" => $logs
]);
?>

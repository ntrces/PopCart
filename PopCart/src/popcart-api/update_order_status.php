<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "popcart";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

if (!isset($_POST['order_header_id']) || !isset($_POST['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing parameters."]);
    exit();
}

$order_header_id = $_POST['order_header_id'];
$status = strtolower($_POST['status']);

// Map status to timestamp columns
$timestampColumns = [
    'approved' => ['approved_date', 'approved_time'],
    'packing' => ['packing_date', 'packing_time'],
    'shipped' => ['shipped_date', 'shipped_time'],
    'delivered' => ['delivered_date', 'delivered_time'],
    'cancelled' => ['cancelled_date', 'cancelled_time']
];

$sql = "UPDATE order_header SET order_status = ?";
$types = "s";
$params = [$status];

if (isset($timestampColumns[$status])) {
    $sql .= ", {$timestampColumns[$status][0]} = CURDATE(), {$timestampColumns[$status][1]} = CURTIME()";
}

$sql .= " WHERE order_header_id = ?";
$types .= "i";
$params[] = $order_header_id;

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed."]);
}

$stmt->close();
$conn->close();
?>
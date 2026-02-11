<?php
require 'cors_config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connect.php';
require 'input_utils.php';
require 'session_config.php';
require 'log_utils.php';

if (!isset($_POST['order_header_id']) || !isset($_POST['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing parameters."]);
    exit();
}

$order_header_id = validate_int($_POST['order_header_id'], 1);
$status = validate_enum(strtolower($_POST['status']), ['approved', 'packing', 'shipped', 'delivered', 'cancelled']);

if (!$order_header_id || !$status) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid parameters."]);
    exit();
}

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
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    if ($actor_id) {
        if ($status === 'cancelled') {
            log_action($conn, $actor_id, $actor_role, "Cancelled order {$order_header_id}");
        } else {
            log_action($conn, $actor_id, $actor_role, "Updated order {$order_header_id} to {$status}");
        }
    }
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed."]);
}

$stmt->close();
$conn->close();
?>
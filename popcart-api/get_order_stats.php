<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

// Get total orders
$query_total = "SELECT COUNT(*) as total FROM order_header WHERE user_id = ?";
$stmt_total = $conn->prepare($query_total);
$stmt_total->bind_param("i", $user_id);
$stmt_total->execute();
$result_total = $stmt_total->get_result();
$total_orders = $result_total->fetch_assoc()['total'];

// Get pending orders
$query_pending = "SELECT COUNT(*) as pending FROM order_header WHERE user_id = ? AND order_status = 'pending'";
$stmt_pending = $conn->prepare($query_pending);
$stmt_pending->bind_param("i", $user_id);
$stmt_pending->execute();
$result_pending = $stmt_pending->get_result();
$pending_orders = $result_pending->fetch_assoc()['pending'];

// Get completed orders (delivered)
$query_completed = "SELECT COUNT(*) as completed FROM order_header WHERE user_id = ? AND order_status = 'delivered'";
$stmt_completed = $conn->prepare($query_completed);
$stmt_completed->bind_param("i", $user_id);
$stmt_completed->execute();
$result_completed = $stmt_completed->get_result();
$completed_orders = $result_completed->fetch_assoc()['completed'];

echo json_encode([
    "success" => true,
    "stats" => [
        "total_orders" => $total_orders,
        "pending_orders" => $pending_orders,
        "completed_orders" => $completed_orders
    ]
]);

$stmt_total->close();
$stmt_pending->close();
$stmt_completed->close();
$conn->close();
?>
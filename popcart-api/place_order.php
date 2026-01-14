<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';
$shipping_address_id = $data['shipping_address_id'] ?? '';
$items = $data['items'] ?? [];

if (!$user_id || !$shipping_address_id || empty($items)) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

// Get next order number for user
$stmt = $conn->prepare("SELECT COALESCE(MAX(order_number), 0) + 1 AS next_order FROM order_header WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$order_number = $row['next_order'];
$stmt->close();

// Insert order header
$stmt = $conn->prepare("INSERT INTO order_header (user_id, shipping_address_id, order_number, order_status, order_date, order_time) VALUES (?, ?, ?, 'pending', CURRENT_DATE(), CURRENT_TIME())");
$stmt->bind_param("iii", $user_id, $shipping_address_id, $order_number);
if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Error creating order header: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}
$order_header_id = $conn->insert_id;
$stmt->close();

// Insert order details
$stmt = $conn->prepare("INSERT INTO order_details (order_header_id, product_id, item_qty, item_price) VALUES (?, ?, ?, ?)");
foreach ($items as $item) {
    $product_id = $item['product_id'];
    $quantity = $item['quantity'];
    $price = $item['price'];
    $stmt->bind_param("iiid", $order_header_id, $product_id, $quantity, $price);
    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error adding order detail for product $product_id: " . $stmt->error]);
        $stmt->close();
        $conn->close();
        exit;
    }
}
$stmt->close();

// Deduct stock
$update_stmt = $conn->prepare("UPDATE products SET stock = stock - ? WHERE product_id = ?");
foreach ($items as $item) {
    $product_id = $item['product_id'];
    $quantity = $item['quantity'];
    $update_stmt->bind_param("ii", $quantity, $product_id);
    if (!$update_stmt->execute()) {
        echo json_encode(["success" => false, "message" => "Error updating stock for product $product_id: " . $update_stmt->error]);
        $update_stmt->close();
        $conn->close();
        exit;
    }
}
$update_stmt->close();

echo json_encode(["success" => true, "message" => "Order placed successfully", "order_id" => $order_header_id]);
$conn->close();
?>
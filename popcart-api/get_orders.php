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

// Get orders with details
$query = "
    SELECT 
        oh.order_header_id,
        oh.order_number,
        CONCAT(oh.order_date, ' ', oh.order_time) AS order_datetime,
        oh.order_status,
        oh.user_id,
        u.firstname,
        u.lastname,
        u.email,
        u.contact_number,
        sa.address_label,
        sa.postal_code,
        sa.street_address,
        sa.city_municipality,
        sa.province,
        od.product_id,
        od.item_qty,
        od.item_price as price,
        p.album_title,
        p.artist,
        p.album_cover_img
    FROM order_header oh
    JOIN users u ON oh.user_id = u.user_id
    LEFT JOIN shipping_address sa ON oh.shipping_address_id = sa.shipping_address_id
    JOIN order_details od ON oh.order_header_id = od.order_header_id
    JOIN products p ON od.product_id = p.product_id
    WHERE oh.user_id = ?
    ORDER BY oh.order_date DESC, oh.order_time DESC, oh.order_header_id DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
$current_order = null;
while ($row = $result->fetch_assoc()) {
    $order_id = $row['order_header_id'];
    
    if (!$current_order || $current_order['order_header_id'] != $order_id) {
        // New order
        $current_order = [
            'order_header_id' => $row['order_header_id'],
            'order_number' => 'ORD' . str_pad($row['order_number'], 3, '0', STR_PAD_LEFT),
            'order_datetime' => $row['order_datetime'],
            'order_status' => strtoupper($row['order_status']),
            'customer' => [
                'firstname' => $row['firstname'],
                'lastname' => $row['lastname'],
                'email' => $row['email'],
                'contact_number' => $row['contact_number']
            ],
            'shipping_address' => [
                'address_label' => $row['address_label'],
                'postal_code' => $row['postal_code'],
                'street_address' => $row['street_address'],
                'city_municipality' => $row['city_municipality'],
                'province' => $row['province']
            ],
            'items' => [],
            'total' => 0
        ];
        $orders[] = $current_order;
    }
    
    // Add item to current order
    $item_total = $row['price'] * $row['item_qty'];
    $current_order['items'][] = [
        'product_id' => $row['product_id'],
        'album_title' => $row['album_title'],
        'artist' => $row['artist'],
        'quantity' => $row['item_qty'],
        'price' => $row['price'],
        'total' => $item_total
    ];
    $current_order['total'] += $item_total;
}

echo json_encode(["success" => true, "orders" => $orders]);

$stmt->close();
$conn->close();
?>
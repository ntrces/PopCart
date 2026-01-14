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

$sql = "
SELECT 
oh.order_header_id, 
oh.order_number, 
oh.order_date, 
oh.order_time, 
oh.order_status,
oh.approved_date,
oh.approved_time,
oh.packing_date,
oh.packing_time,
oh.shipped_date,
oh.shipped_time,
oh.delivered_date,
oh.delivered_time,
oh.cancelled_date,
oh.cancelled_time,
u.lastname, 
u.firstname, 
u.email, 
u.contact_number,
sa.address_label, 
sa.street_address, 
sa.city_municipality, 
sa.province, 
sa.postal_code
FROM order_header oh
JOIN users u ON oh.user_id = u.user_id
JOIN shipping_address sa ON oh.shipping_address_id = sa.shipping_address_id
ORDER BY oh.order_date DESC, oh.order_time DESC
";

$result = $conn->query($sql);
$orders = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $status = strtoupper($row['order_status']);
        $statusBg = match($status) {
            'PENDING' => '#fef9c2',
            'APPROVED' => '#ffefdb',
            'PACKING' => '#e6f0ff',
            'SHIPPED' => '#f2c1fd',
            'DELIVERED' => '#d1fae5',
            'CANCELLED' => '#ffa1a1',
            default => '#ffffff',
        };
        $statusColor = match($status) {
            'PENDING' => '#884a00',
            'APPROVED' => '#ff6a00',
            'PACKING' => '#193bb8',
            'SHIPPED' => '#980ffa',
            'DELIVERED' => '#016630',
            'CANCELLED' => '#b91c1c',
            default => '#000000',
        };
        $order = [
            'order_header_id' => $row['order_header_id'],
            'order_number' => 'ORD' . str_pad($row['order_number'], 3, '0', STR_PAD_LEFT),
            'order_datetime' => $row['order_date'] . ' ' . $row['order_time'],
            'order_status' => $status,
            'statusBg' => $statusBg,
            'statusColor' => $statusColor,
            'customer' => $row['lastname'] . ' ' . $row['firstname'] . ' • ' . $row['email'],
            'user' => [
                'name' => $row['firstname'] . ' ' . $row['lastname'],
                'email' => $row['email'],
                'contact' => $row['contact_number']
            ],
            'shipping_address' => ($row['address_label'] ? $row['address_label'] . ': ' : '') . $row['street_address'] . ', ' . $row['city_municipality'] . ', ' . $row['province'] . ', ' . $row['postal_code']
        ];

        // Fetch items
        $item_sql = "
        SELECT od.item_qty AS quantity, p.album_title, p.artist, od.item_price AS price, (od.item_qty * od.item_price) AS total
        FROM order_details od
        JOIN products p ON od.product_id = p.product_id
        WHERE od.order_header_id = ?
        ";
        $stmt = $conn->prepare($item_sql);
        $stmt->bind_param("i", $row['order_header_id']);
        $stmt->execute();
        $item_result = $stmt->get_result();
        $items = [];
        $order_total = 0;
        while ($item_row = $item_result->fetch_assoc()) {
            $items[] = [
                'id' => count($items) + 1,
                'name' => $item_row['album_title'] . ' by ' . $item_row['artist'],
                'quantity' => (int)$item_row['quantity'],
                'price' => '₱' . number_format($item_row['price'], 2),
                'total' => (float)$item_row['total']
            ];
            $order_total += $item_row['total'];
        }
        $order['items'] = $items;
        $order['total'] = '₱' . number_format($order_total, 2);
        
        // Determine display date based on status
        switch (strtolower($row['order_status'])) {
            case 'pending':
                $display_datetime = $row['order_date'] . ' ' . $row['order_time'];
                break;
            case 'approved':
                $display_datetime = $row['approved_date'] . ' ' . $row['approved_time'];
                break;
            case 'packing':
                $display_datetime = $row['packing_date'] . ' ' . $row['packing_time'];
                break;
            case 'shipped':
                $display_datetime = $row['shipped_date'] . ' ' . $row['shipped_time'];
                break;
            case 'delivered':
                $display_datetime = $row['delivered_date'] . ' ' . $row['delivered_time'];
                break;
            case 'cancelled':
                $display_datetime = $row['cancelled_date'] . ' ' . $row['cancelled_time'];
                break;
            default:
                $display_datetime = $row['order_date'] . ' ' . $row['order_time'];
        }
        
        $order['date'] = $display_datetime ? date('M d, Y, h:i A', strtotime($display_datetime)) : 'N/A';
        $orders[] = $order;
        $stmt->close();
    }
}

echo json_encode(["success" => true, "orders" => $orders]);
$conn->close();
?>
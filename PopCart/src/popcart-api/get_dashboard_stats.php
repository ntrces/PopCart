<?php
require 'cors_config.php';
require 'db_connect.php';

header('Content-Type: application/json');

if (!$conn || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// 1. Total Transactions: All-time count of all orders
$totalTransactionsQuery = "SELECT COUNT(*) as total FROM order_header";
$totalTransactionsResult = $conn->query($totalTransactionsQuery);
$totalTransactions = $totalTransactionsResult->fetch_assoc()['total'];

// 2. Total Revenue: Sum of (qty * price) for ALL delivered orders
$totalRevenueQuery = "
    SELECT SUM(od.item_qty * od.item_price) as total_revenue
    FROM order_details od
    JOIN order_header oh ON od.order_header_id = oh.order_header_id
    WHERE oh.order_status = 'delivered'
";
$totalRevenueResult = $conn->query($totalRevenueQuery);
$totalRevenue = $totalRevenueResult->fetch_assoc()['total_revenue'] ?? 0;

// 3. Status counts for the status grid - Using prepared statements to prevent SQL injection
$statusCounts = [];
$statuses = ['pending', 'approved', 'packing', 'shipped', 'delivered', 'cancelled'];
foreach ($statuses as $status) {
    $query = "SELECT COUNT(*) as count FROM order_header WHERE order_status = ?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error preparing statement"]);
        exit();
    }
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
    $statusCounts[$status] = $result->fetch_assoc()['count'];
    $stmt->close();
}

// 4. Sales Today: Count of orders delivered TODAY
$salesTodayQuery = "SELECT COUNT(*) as sales FROM order_header WHERE order_status = 'delivered' AND DATE(delivered_date) = CURDATE()";
$salesTodayResult = $conn->query($salesTodayQuery);
$salesToday = (int)$salesTodayResult->fetch_assoc()['sales'];

// 5. Revenue Today: Sum of (qty * price) for orders delivered TODAY
$revenueTodayQuery = "
    SELECT SUM(od.item_qty * od.item_price) as revenue
    FROM order_details od
    JOIN order_header oh ON od.order_header_id = oh.order_header_id
    WHERE oh.order_status = 'delivered' AND DATE(oh.delivered_date) = CURDATE()
";
$revenueTodayResult = $conn->query($revenueTodayQuery);
$revenueToday = (float)($revenueTodayResult->fetch_assoc()['revenue'] ?? 0);

echo json_encode([
    "success" => true,
    "total_transactions" => $totalTransactions,
    "total_revenue" => '₱' . number_format($totalRevenue, 2),
    "status_counts" => $statusCounts,
    "sales_today" => $salesToday,
    "revenue_today" => round($revenueToday, 2)
]);
?>
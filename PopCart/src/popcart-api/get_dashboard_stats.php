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

// Total Transactions: count of order_header
$totalTransactionsQuery = "SELECT COUNT(*) as total FROM order_header";
$totalTransactionsResult = $conn->query($totalTransactionsQuery);
$totalTransactions = $totalTransactionsResult->fetch_assoc()['total'];

// Total Revenue: sum of item_qty * item_price from order_details where order_status = 'delivered'
$totalRevenueQuery = "
SELECT SUM(od.item_qty * od.item_price) as total_revenue
FROM order_details od
JOIN order_header oh ON od.order_header_id = oh.order_header_id
WHERE oh.order_status = 'delivered'
";
$totalRevenueResult = $conn->query($totalRevenueQuery);
$totalRevenue = $totalRevenueResult->fetch_assoc()['total_revenue'] ?? 0;

// Status counts
$statusCounts = [];
$statuses = ['pending', 'approved', 'packing', 'shipped', 'delivered', 'cancelled'];
foreach ($statuses as $status) {
    $query = "SELECT COUNT(*) as count FROM order_header WHERE order_status = '$status'";
    $result = $conn->query($query);
    $statusCounts[$status] = $result->fetch_assoc()['count'];
}

// Today's sales and revenue for delivered
$today = date('Y-m-d');
$salesTodayQuery = "SELECT COUNT(*) as sales FROM order_header WHERE order_status = 'delivered' AND delivered_date = '$today'";
$salesTodayResult = $conn->query($salesTodayQuery);
$salesToday = $salesTodayResult->fetch_assoc()['sales'];

$revenueTodayQuery = "
SELECT SUM(od.item_qty * od.item_price) as revenue
FROM order_details od
JOIN order_header oh ON od.order_header_id = oh.order_header_id
WHERE oh.order_status = 'delivered' AND oh.delivered_date = '$today'
";
$revenueTodayResult = $conn->query($revenueTodayQuery);
$revenueToday = $revenueTodayResult->fetch_assoc()['revenue'] ?? 0;

echo json_encode([
    "success" => true,
    "total_transactions" => $totalTransactions,
    "total_revenue" => '₱' . number_format($totalRevenue, 2),
    "status_counts" => $statusCounts,
    "sales_today" => $salesToday,
    "revenue_today" => $revenueToday
]);

$conn->close();
?>
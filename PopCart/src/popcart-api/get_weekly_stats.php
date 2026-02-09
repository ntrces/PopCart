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

// Get the start of the week (Sunday)
$today = date('Y-m-d');
$dayOfWeek = date('w', strtotime($today)); // 0 = Sunday
$startOfWeek = date('Y-m-d', strtotime($today . ' -' . $dayOfWeek . ' days'));

// Initialize arrays for 7 days
$days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
$weeklySales = [];
$weeklyRevenue = [];

for ($i = 0; $i < 7; $i++) {
    $date = date('Y-m-d', strtotime($startOfWeek . ' +' . $i . ' days'));
    
    // Sales for this day - Using prepared statement to prevent SQL injection
    $salesQuery = "SELECT COUNT(*) as sales FROM order_header WHERE order_status = 'delivered' AND delivered_date = ?";
    $stmt = $conn->prepare($salesQuery);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $salesResult = $stmt->get_result();
    $sales = $salesResult->fetch_assoc()['sales'];
    $stmt->close();
    
    // Revenue for this day - Using prepared statement to prevent SQL injection
    $revenueQuery = "
    SELECT SUM(od.item_qty * od.item_price) as revenue
    FROM order_details od
    JOIN order_header oh ON od.order_header_id = oh.order_header_id
    WHERE oh.order_status = 'delivered' AND oh.delivered_date = ?
    ";
    $stmt = $conn->prepare($revenueQuery);
    $stmt->bind_param("s", $date);
    $stmt->execute();
    $revenueResult = $stmt->get_result();
    $revenue = $revenueResult->fetch_assoc()['revenue'] ?? 0;
    $stmt->close();
    
    $weeklySales[] = $sales;
    $weeklyRevenue[] = $revenue;
}

echo json_encode([
    "success" => true,
    "weekly_sales" => $weeklySales,
    "weekly_revenue" => $weeklyRevenue,
    "days" => $days
]);

$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';

$year = validate_int($_GET['year'] ?? date('Y'), 2000, 2100);

if (!$year) {
    echo json_encode(["success" => false, "message" => "Invalid year."]);
    exit;
}

// Revenue: sum of item_qty * item_price for delivered orders per month
$revenueQuery = "
    SELECT 
        MONTH(oh.delivered_date) as month,
        SUM(od.item_qty * od.item_price) as revenue
    FROM order_header oh
    JOIN order_details od ON oh.order_header_id = od.order_header_id
    WHERE oh.order_status = 'delivered' AND YEAR(oh.delivered_date) = ?
    GROUP BY MONTH(oh.delivered_date)
    ORDER BY MONTH(oh.delivered_date)
";

$stmt = $conn->prepare($revenueQuery);
$stmt->bind_param("i", $year);
$stmt->execute();
$result = $stmt->get_result();

$revenue = array_fill(0, 12, 0); // Jan to Dec
while ($row = $result->fetch_assoc()) {
    $month = (int)$row['month'] - 1; // 0-based
    $revenue[$month] = (float)$row['revenue'];
}

// Sales: count of delivered orders per month
$salesQuery = "
    SELECT 
        MONTH(delivered_date) as month,
        COUNT(*) as sales
    FROM order_header
    WHERE order_status = 'delivered' AND YEAR(delivered_date) = ?
    GROUP BY MONTH(delivered_date)
    ORDER BY MONTH(delivered_date)
";

$stmt2 = $conn->prepare($salesQuery);
$stmt2->bind_param("i", $year);
$stmt2->execute();
$result2 = $stmt2->get_result();

$sales = array_fill(0, 12, 0);
while ($row = $result2->fetch_assoc()) {
    $month = (int)$row['month'] - 1;
    $sales[$month] = (int)$row['sales'];
}

echo json_encode([
    "success" => true,
    "year" => $year,
    "revenue" => $revenue,
    "sales" => $sales
]);
?>
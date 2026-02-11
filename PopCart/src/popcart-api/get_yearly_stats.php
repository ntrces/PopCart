<?php
require 'cors_config.php';
require 'db_connect.php';

header("Content-Type: application/json");

if (!$conn || $conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get distinct years from delivered_date where order_status='delivered'
$yearsQuery = "
    SELECT DISTINCT YEAR(delivered_date) as year
    FROM order_header
    WHERE order_status = 'delivered' AND delivered_date IS NOT NULL
    ORDER BY year
";

$result = $conn->query($yearsQuery);
$years = [];
while ($row = $result->fetch_assoc()) {
    $years[] = (int)$row['year'];
}

// If no years, default to current year
if (empty($years)) {
    $years = [date('Y')];
}

// For each year, get revenue and sales
$data = [];
foreach ($years as $year) {
    // Revenue
    $revQuery = "
        SELECT SUM(od.item_qty * od.item_price) as revenue
        FROM order_header oh
        JOIN order_details od ON oh.order_header_id = od.order_header_id
        WHERE oh.order_status = 'delivered' AND YEAR(oh.delivered_date) = ?
    ";
    $stmt = $conn->prepare($revQuery);
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $revResult = $stmt->get_result();
    $revenue = $revResult->fetch_assoc()['revenue'] ?? 0;

    // Sales
    $salesQuery = "
        SELECT COUNT(*) as sales
        FROM order_header
        WHERE order_status = 'delivered' AND YEAR(delivered_date) = ?
    ";
    $stmt2 = $conn->prepare($salesQuery);
    $stmt2->bind_param("i", $year);
    $stmt2->execute();
    $salesResult = $stmt2->get_result();
    $sales = $salesResult->fetch_assoc()['sales'] ?? 0;

    $data[] = [
        "year" => $year,
        "Revenue" => (float)$revenue,
        "Sales" => (int)$sales
    ];
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
?>
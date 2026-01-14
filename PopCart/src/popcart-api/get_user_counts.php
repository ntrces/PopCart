<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

$sql_total = "SELECT COUNT(*) as total FROM users WHERE status = 'active'";
$result_total = $conn->query($sql_total);
$total = 0;
if ($result_total) {
    $row = $result_total->fetch_assoc();
    $total = $row['total'];
}

$sql_customer = "SELECT COUNT(*) as count FROM users WHERE usertype = 'buyer' AND status = 'active'";
$result_customer = $conn->query($sql_customer);
$customer = 0;
if ($result_customer) {
    $row = $result_customer->fetch_assoc();
    $customer = $row['count'];
}

$sql_employee = "SELECT COUNT(*) as count FROM users WHERE usertype = 'employee' AND status = 'active'";
$result_employee = $conn->query($sql_employee);
$employee = 0;
if ($result_employee) {
    $row = $result_employee->fetch_assoc();
    $employee = $row['count'];
}

$sql_admin = "SELECT COUNT(*) as count FROM users WHERE usertype = 'admin' AND status = 'active'";
$result_admin = $conn->query($sql_admin);
$admin = 0;
if ($result_admin) {
    $row = $result_admin->fetch_assoc();
    $admin = $row['count'];
}

echo json_encode([
    "success" => true,
    "counts" => [
        "all" => $total,
        "customer" => $customer,
        "employee" => $employee,
        "admin" => $admin
    ]
]);

$conn->close();
?>
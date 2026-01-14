<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db_connect.php';

$stmt = $conn->prepare("SELECT product_id, album_title, artist, album_cover_img FROM products WHERE product_status = 'active' ORDER BY product_id DESC LIMIT 4");
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode(["success" => true, "products" => $products]);

$stmt->close();
$conn->close();
?>
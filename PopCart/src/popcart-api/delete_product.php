<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
// Accept product_id from JSON payload or form-encoded POST (for compatibility)
$product_id = '';
if (is_array($data) && isset($data['product_id'])) {
    $product_id = $data['product_id'];
} elseif (isset($_POST['product_id'])) {
    $product_id = $_POST['product_id'];
} elseif (isset($_GET['product_id'])) {
    $product_id = $_GET['product_id'];
}

// sanitize/validate
$product_id = intval($product_id);

if ($product_id <= 0) {
    echo json_encode(["success" => false, "message" => "Product ID required or invalid"]);
    exit;
}

$stmt = $conn->prepare("UPDATE products SET product_status = 'inactive' WHERE product_id = ?");
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product deactivated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to deactivate product"]);
}

$stmt->close();
$conn->close();
?>
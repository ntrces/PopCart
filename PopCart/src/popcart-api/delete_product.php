<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db_connect.php';
require 'input_utils.php';
require 'session_config.php';
require 'log_utils.php';

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
$product_id = validate_int($product_id, 1);

if (!$product_id) {
    echo json_encode(["success" => false, "message" => "Product ID required or invalid"]);
    exit;
}

$stmt = $conn->prepare("UPDATE products SET product_status = 'inactive' WHERE product_id = ?");
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    if ($actor_id) {
        log_action($conn, $actor_id, $actor_role, "Deleted product {$product_id}");
    }
    echo json_encode(["success" => true, "message" => "Product deactivated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to deactivate product"]);
}

$stmt->close();
$conn->close();
?>
<?php
require 'cors_config.php';
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

$data = $_POST;
$product_id = validate_int($data['product_id'] ?? null, 1);
$price = validate_float($data['price'] ?? null, 0);
$stock = validate_int($data['stock'] ?? null, 0);

if (!$product_id || $price === null || $stock === null) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

// Fetch original product data BEFORE update for change tracking
$original_stmt = $conn->prepare("SELECT price, stock FROM products WHERE product_id = ?");
$original_stmt->bind_param("i", $product_id);
$original_stmt->execute();
$original_result = $original_stmt->get_result();
$original_row = $original_result->fetch_assoc();
$original_stmt->close();

// Handle image uploads if provided
$album_cover_img = null;
if (!empty($_FILES['album_cover_img'])) {
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $uploadedImages = [];
    foreach ($_FILES['album_cover_img']['name'] as $key => $name) {
        if ($_FILES['album_cover_img']['error'][$key] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['album_cover_img']['tmp_name'][$key];
            $fileName = uniqid() . '_' . basename($name);
            $filePath = $uploadDir . $fileName;
            if (move_uploaded_file($tmpName, $filePath)) {
                // Store full relative path from web root (localhost)
                $uploadedImages[] = 'PopCart1/PopCart/PopCart/src/uploads/' . $fileName;
            }
        }
    }
    $album_cover_img = implode(',', $uploadedImages);
}

if ($album_cover_img) {
    $stmt = $conn->prepare("UPDATE products SET price = ?, stock = ?, album_cover_img = ? WHERE product_id = ?");
    $stmt->bind_param("disi", $price, $stock, $album_cover_img, $product_id);
} else {
    $stmt = $conn->prepare("UPDATE products SET price = ?, stock = ? WHERE product_id = ?");
    $stmt->bind_param("dii", $price, $stock, $product_id);
}

if ($stmt->execute()) {
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    
    // If session doesn't have user_id, try to get from localStorage (backup - though this shouldn't be needed)
    if (!$actor_id) {
        error_log("Warning: No session user_id found in update_product.php");
    }
    
    // Log only the fields that actually changed
    if ($actor_id && $original_row) {
        if (abs((float)$original_row['price'] - (float)$price) > 0.001) {
            log_action($conn, $actor_id, $actor_role, "Updated the price of product {$product_id} to ₱" . number_format($price, 2));
        }
        if ((int)$original_row['stock'] !== (int)$stock) {
            log_action($conn, $actor_id, $actor_role, "Updated the stock of product {$product_id} to {$stock}");
        }
        if ($album_cover_img) {
            log_action($conn, $actor_id, $actor_role, "Updated the cover image of product {$product_id}");
        }
    }
    
    echo json_encode(["success" => true, "message" => "Product updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update product"]);
}

$stmt->close();
$conn->close();
?>
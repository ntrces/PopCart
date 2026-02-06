<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';

$data = $_POST;
$product_id = validate_int($data['product_id'] ?? null, 1);
$price = validate_float($data['price'] ?? null, 0);
$stock = validate_int($data['stock'] ?? null, 0);

if (!$product_id || $price === null || $stock === null) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

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
    echo json_encode(["success" => true, "message" => "Product updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update product"]);
}

$stmt->close();
$conn->close();
?>
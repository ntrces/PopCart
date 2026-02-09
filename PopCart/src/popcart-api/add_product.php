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

$data = $_POST;

$album_title = sanitize_text($data['album_title'] ?? '', 150);
$artist = sanitize_text($data['artist'] ?? '', 150);
$price = validate_float($data['price'] ?? null, 0);
$stock = validate_int($data['stock'] ?? null, 0);
$genre = sanitize_text($data['genre'] ?? '', 80);
$released_year = sanitize_string($data['released_year'] ?? '', 4);
$description = sanitize_text($data['description'] ?? '', 2000);

if (!$album_title || !$artist || $price === null || $stock === null) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

// Handle image uploads
$uploadedImages = [];
if (!empty($_FILES['album_cover_img'])) {
    $uploadDir = '../uploads/'; // This creates src/uploads/ folder
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

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
}

$album_cover_img = implode(',', $uploadedImages);

$stmt = $conn->prepare("INSERT INTO products (album_title, artist, price, stock, genre, released_year, album_cover_img, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdissss", $album_title, $artist, $price, $stock, $genre, $released_year, $album_cover_img, $description);

if ($stmt->execute()) {
    $new_product_id = (int)$conn->insert_id;
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    if ($actor_id && $new_product_id) {
        log_action($conn, $actor_id, $actor_role, "Added product {$new_product_id}");
    }
    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add product"]);
}

$stmt->close();
$conn->close();
?>
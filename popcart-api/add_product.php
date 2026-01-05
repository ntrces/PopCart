<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

$data = $_POST;

$album_title = $data['album_title'] ?? '';
$artist = $data['artist'] ?? '';
$price = $data['price'] ?? '';
$stock = $data['stock'] ?? '';
$genre = $data['genre'] ?? '';
$released_year = $data['released_year'] ?? '';
$description = $data['description'] ?? '';

if (!$album_title || !$artist || !$price || !$stock) {
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

// Handle image uploads
$uploadedImages = [];
if (!empty($_FILES['album_cover_img'])) {
    $uploadDir = '../uploads/'; // Assuming uploads folder in htdocs
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    foreach ($_FILES['album_cover_img']['name'] as $key => $name) {
        if ($_FILES['album_cover_img']['error'][$key] === UPLOAD_ERR_OK) {
            $tmpName = $_FILES['album_cover_img']['tmp_name'][$key];
            $fileName = uniqid() . '_' . basename($name);
            $filePath = $uploadDir . $fileName;
            if (move_uploaded_file($tmpName, $filePath)) {
                $uploadedImages[] = 'uploads/' . $fileName;
            }
        }
    }
}

$album_cover_img = implode(',', $uploadedImages);

$stmt = $conn->prepare("INSERT INTO products (album_title, artist, price, stock, genre, released_year, album_cover_img, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdissss", $album_title, $artist, $price, $stock, $genre, $released_year, $album_cover_img, $description);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to add product"]);
}

$stmt->close();
$conn->close();
?>
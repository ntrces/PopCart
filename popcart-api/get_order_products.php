<?php
header('Content-Type: application/json');
// Set CORS headers if needed for local development
header('Access-Control-Allow-Origin: *'); 

// 1. Database Connection (Replace with your actual credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "popcart"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// 2. Get the Order Header ID from the URL
if (!isset($_GET['order_header_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing order_header_id parameter."]);
    exit();
}

$order_header_id = $_GET['order_header_id'];

// 3. Prepare and Execute the SQL Query
$sql = "
SELECT 
od.item_qty AS quantity, 
p.album_title, 
p.artist,
od.item_price AS price,
(od.item_qty * od.item_price) AS total
FROM order_details od
JOIN products p ON 
od.product_id = p.product_id
WHERE od.order_header_id = ?
";

$stmt = $conn->prepare($sql);
// 'i' denotes that the parameter is an integer
$stmt->bind_param("i", $order_header_id); 
$stmt->execute();

$result = $stmt->get_result();
$items = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $items[] = [
            // Ensure the keys match what the React component expects:
            "album_title" => $row['album_title'],
            "artist" => $row['artist'],            "price" => (float)$row['price'],            "quantity" => (int)$row['quantity'], // Cast quantity to integer
            "total" => (float)$row['total']    // Cast total to float
        ];
    }
    echo json_encode(["success" => true, "items" => $items]);
} else {
    echo json_encode(["success" => true, "items" => []]);
}

$stmt->close();
$conn->close();
?>
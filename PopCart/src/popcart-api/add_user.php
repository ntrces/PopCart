<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// --- 1. Database Connection Configuration ---
$servername = "localhost";
$username = "root"; // XAMPP default
$password = ""; // XAMPP default is empty
$dbname = "popcart";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}


// --- 2. Get POST data ---
$data = json_decode(file_get_contents("php://input"), true);

$lastname = $data['lastname'] ?? '';
$firstname = $data['firstname'] ?? '';
$email = $data['email'] ?? '';
$birthday = $data['birthday'] ?? '';
$plainPassword = $data['password'] ?? '';
$usertype = $data['usertype'] ?? '';
$status = "active";

// Validate input
if (empty($lastname) || empty($firstname) || empty($email) || empty($plainPassword) || empty($usertype)) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

if (!in_array($usertype, ['buyer', 'employee', 'admin'])) {
    echo json_encode(["success" => false, "message" => "Invalid user type."]);
    exit;
}

// Check if email already exists in both tables
$checkEmail1 = $conn->prepare("SELECT * FROM users WHERE email = ?");
$checkEmail1->bind_param("s", $email);
$checkEmail1->execute();
$checkResult1 = $checkEmail1->get_result();

$checkEmail2 = $conn->prepare("SELECT * FROM admins WHERE email = ?");
$checkEmail2->bind_param("s", $email);
$checkEmail2->execute();
$checkResult2 = $checkEmail2->get_result();

if ($checkResult1->num_rows > 0 || $checkResult2->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered."]);
    exit;
}

// --- 3. Secure Password Hashing ---
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// --- 4. Determine which table to insert into based on usertype ---
$table = ($usertype === 'admin') ? 'admins' : 'users';

// --- 5. Prepared Statement Execution ---
$stmt = $conn->prepare("INSERT INTO $table (lastname, firstname, email, birthday, password, usertype, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $lastname, $firstname, $email, $birthday, $hashedPassword, $usertype, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User added successfully!"]);
} else {
    // Check for unique constraint violation (email already exists)
    if ($conn->errno === 1062) {
        echo json_encode(["success" => false, "message" => "The email address '$email' already exists."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>
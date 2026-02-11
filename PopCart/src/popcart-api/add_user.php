<?php
require 'cors_config.php';
header("Content-Type: application/json");

// Include password utility functions for secure hashing
require 'db_connect.php';
require 'password_utils.php';
require 'input_utils.php';
require 'session_config.php';
require 'log_utils.php';

// --- Get POST data ---
$data = read_json_input();

$lastname = sanitize_text($data['lastname'] ?? '', 100);
$firstname = sanitize_text($data['firstname'] ?? '', 100);
$email_error = null;
$password_error = null;
$email = validate_email($data['email'] ?? '', $email_error);
$birthday = sanitize_string($data['birthday'] ?? '', 10);
$plainPassword = validate_password_length($data['password'] ?? '', $password_error);
$usertype = validate_enum($data['usertype'] ?? '', ['buyer', 'employee', 'admin']);
$status = "active";

// Validate input
if (empty($lastname) || empty($firstname) || empty($email) || empty($plainPassword) || empty($usertype)) {
    // Show specific password requirement error during user creation
    if (empty($plainPassword) && $password_error) {
        echo json_encode(["success" => false, "message" => "Password should have 8-12 characters"]);
    } else {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
    }
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
    echo json_encode(["success" => false, "message" => "This email has already been used"]);
    $checkEmail1->close();
    $checkEmail2->close();
    exit;
}
$checkEmail1->close();
$checkEmail2->close();

// --- 3. Secure Password Hashing using ARGON2ID ---
$hashedPassword = hashPassword($plainPassword);

// --- 4. Determine which table to insert into based on usertype ---
$table = ($usertype === 'admin') ? 'admins' : 'users';

// --- 5. Prepared Statement Execution ---
$stmt = $conn->prepare("INSERT INTO $table (lastname, firstname, email, birthday, password, usertype, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $lastname, $firstname, $email, $birthday, $hashedPassword, $usertype, $status);

if ($stmt->execute()) {
    $new_user_id = (int)$conn->insert_id;
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    if ($new_user_id && $actor_id) {
        $action_usertype = ucfirst($usertype);
        log_action($conn, $actor_id, $actor_role, "Added {$action_usertype} {$new_user_id}");
    }
    echo json_encode(["success" => true, "message" => "User added successfully!"]);
} else {
    // Check for unique constraint violation (email already exists)
    if ($conn->errno === 1062) {
        echo json_encode(["success" => false, "message" => "This email has already been used"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>
<?php
require 'cors_config.php';
header("Content-Type: application/json");

require 'db_connect.php';
require 'input_utils.php';
require 'session_config.php';
require 'log_utils.php';

$user_id = validate_int($_POST['user_id'] ?? null, 1);
$status = validate_enum($_POST['status'] ?? '', ['active', 'inactive']);
$source_table = validate_enum($_POST['source_table'] ?? 'users', ['users', 'admins']);

if (!$user_id || !$status) {
    echo json_encode(["success" => false, "message" => "User ID and status required"]);
    exit;
}

// Get the current usertype before updating status
$usertype_stmt = $conn->prepare("SELECT usertype FROM $source_table WHERE user_id = ?");
$usertype_stmt->bind_param("i", $user_id);
$usertype_stmt->execute();
$usertype_result = $usertype_stmt->get_result();
$user_usertype = null;
if ($row = $usertype_result->fetch_assoc()) {
    $user_usertype = $row['usertype'];
}
$usertype_stmt->close();

$stmt = $conn->prepare("UPDATE $source_table SET status = ? WHERE user_id = ?");
$stmt->bind_param("si", $status, $user_id);

if ($stmt->execute()) {
    $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
    $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
    if ($actor_id && $user_usertype) {
        $action_usertype = ucfirst($user_usertype);
        if ($status === 'inactive') {
            log_action($conn, $actor_id, $actor_role, "Deactivated {$action_usertype} {$user_id}");
        } else {
            log_action($conn, $actor_id, $actor_role, "Activated {$action_usertype} {$user_id}");
        }
    }
    echo json_encode(["success" => true, "message" => "User status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating user status"]);
}

$stmt->close();
$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['usertype']) && isset($_POST['old_usertype'])) {
        // Admin edit usertype with complex table management
        $user_id = $_POST['user_id'];
        $email = $_POST['email'];
        $new_usertype = $_POST['usertype'];
        $old_usertype = $_POST['old_usertype'];
        $source_table = $_POST['source_table'] ?? 'users';

        if (!in_array($new_usertype, ['buyer', 'employee', 'admin'])) {
            echo json_encode(["success" => false, "message" => "Invalid user type"]);
            exit;
        }

        // Scenario 1: Buyer/Employee -> Admin
        if (in_array($old_usertype, ['buyer', 'employee']) && $new_usertype === 'admin') {
            // Check if user exists in admins table (was previously admin)
            $check_admin = $conn->prepare("SELECT * FROM admins WHERE email = ?");
            $check_admin->bind_param("s", $email);
            $check_admin->execute();
            $admin_result = $check_admin->get_result();
            
            if ($admin_result->num_rows > 0) {
                // User was previously an admin, reactivate their admin account
                $stmt_reactivate = $conn->prepare("UPDATE admins SET status = 'active', usertype = ? WHERE email = ?");
                $stmt_reactivate->bind_param("ss", $new_usertype, $email);
                $stmt_reactivate->execute();
                $stmt_reactivate->close();
                
                // Deactivate their users table account
                $stmt_deactivate = $conn->prepare("UPDATE users SET status = 'inactive' WHERE email = ?");
                $stmt_deactivate->bind_param("s", $email);
                $stmt_deactivate->execute();
                $stmt_deactivate->close();
            } else {
                // First time becoming admin, get their data from users table
                $stmt_get = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
                $stmt_get->bind_param("i", $user_id);
                $stmt_get->execute();
                $user_data = $stmt_get->get_result()->fetch_assoc();
                $stmt_get->close();
                
                if ($user_data) {
                    // Insert into admins table
                    $stmt_insert = $conn->prepare("INSERT INTO admins (lastname, firstname, email, birthday, password, contact_number, shipping_id, usertype, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')");
                    $stmt_insert->bind_param("ssssssss", 
                        $user_data['lastname'], 
                        $user_data['firstname'], 
                        $user_data['email'], 
                        $user_data['birthday'], 
                        $user_data['password'], 
                        $user_data['contact_number'], 
                        $user_data['shipping_id'], 
                        $new_usertype
                    );
                    $stmt_insert->execute();
                    $stmt_insert->close();
                    
                    // Deactivate in users table
                    $stmt_deactivate = $conn->prepare("UPDATE users SET status = 'inactive' WHERE user_id = ?");
                    $stmt_deactivate->bind_param("i", $user_id);
                    $stmt_deactivate->execute();
                    $stmt_deactivate->close();
                }
            }
            $check_admin->close();
            echo json_encode(["success" => true, "message" => "User promoted to admin successfully"]);
        }
        // Scenario 2: Admin -> Buyer/Employee
        else if ($old_usertype === 'admin' && in_array($new_usertype, ['buyer', 'employee'])) {
            // Check if user exists in users table (was previously buyer/employee)
            $check_user = $conn->prepare("SELECT * FROM users WHERE email = ?");
            $check_user->bind_param("s", $email);
            $check_user->execute();
            $user_result = $check_user->get_result();
            
            if ($user_result->num_rows > 0) {
                // User was previously in users table, reactivate their users account
                $stmt_reactivate = $conn->prepare("UPDATE users SET status = 'active', usertype = ? WHERE email = ?");
                $stmt_reactivate->bind_param("ss", $new_usertype, $email);
                $stmt_reactivate->execute();
                $stmt_reactivate->close();
                
                // Deactivate their admins table account
                $stmt_deactivate = $conn->prepare("UPDATE admins SET status = 'inactive' WHERE email = ?");
                $stmt_deactivate->bind_param("s", $email);
                $stmt_deactivate->execute();
                $stmt_deactivate->close();
            } else {
                // First time becoming buyer/employee, get their data from admins table
                $stmt_get = $conn->prepare("SELECT * FROM admins WHERE user_id = ?");
                $stmt_get->bind_param("i", $user_id);
                $stmt_get->execute();
                $admin_data = $stmt_get->get_result()->fetch_assoc();
                $stmt_get->close();
                
                if ($admin_data) {
                    // Insert into users table
                    $stmt_insert = $conn->prepare("INSERT INTO users (lastname, firstname, email, birthday, password, contact_number, shipping_id, usertype, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')");
                    $stmt_insert->bind_param("ssssssss", 
                        $admin_data['lastname'], 
                        $admin_data['firstname'], 
                        $admin_data['email'], 
                        $admin_data['birthday'], 
                        $admin_data['password'], 
                        $admin_data['contact_number'], 
                        $admin_data['shipping_id'], 
                        $new_usertype
                    );
                    $stmt_insert->execute();
                    $stmt_insert->close();
                    
                    // Deactivate in admins table
                    $stmt_deactivate = $conn->prepare("UPDATE admins SET status = 'inactive' WHERE user_id = ?");
                    $stmt_deactivate->bind_param("i", $user_id);
                    $stmt_deactivate->execute();
                    $stmt_deactivate->close();
                }
            }
            $check_user->close();
            echo json_encode(["success" => true, "message" => "User role changed successfully"]);
        }
        // Scenario 3: Buyer <-> Employee (staying in users table)
        else if (in_array($old_usertype, ['buyer', 'employee']) && in_array($new_usertype, ['buyer', 'employee'])) {
            $stmt = $conn->prepare("UPDATE users SET usertype = ? WHERE user_id = ?");
            $stmt->bind_param("si", $new_usertype, $user_id);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "User role updated successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error updating user role"]);
            }
            $stmt->close();
        }
        else {
            echo json_encode(["success" => false, "message" => "Invalid role change"]);
        }
    } else {
        // Profile update (JSON)
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = $data['user_id'] ?? '';
        $lastname = $data['lastname'] ?? '';
        $firstname = $data['firstname'] ?? '';
        $birthday = $data['birthday'] ?? '';
        $contact_number = $data['contact_number'] ?? '';

        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User ID required"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE users SET lastname = ?, firstname = ?, birthday = ?, contact_number = ? WHERE user_id = ?");
        $stmt->bind_param("ssssi", $lastname, $firstname, $birthday, $contact_number, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating profile"]);
        }

        $stmt->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

$conn->close();
?>
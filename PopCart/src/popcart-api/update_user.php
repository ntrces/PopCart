<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db_connect.php';

// Include password utility functions for secure password hashing
require 'password_utils.php';
require 'input_utils.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['usertype']) && isset($_POST['old_usertype'])) {
        // Admin edit usertype with complex table management
        $error = null;
        $user_id = validate_int($_POST['user_id'] ?? null, 1);
        $email = validate_email($_POST['email'] ?? '', $error);
        $new_usertype = validate_enum($_POST['usertype'] ?? '', ['buyer', 'employee', 'admin']);
        $old_usertype = validate_enum($_POST['old_usertype'] ?? '', ['buyer', 'employee', 'admin']);
        $source_table = validate_enum($_POST['source_table'] ?? 'users', ['users', 'admins']) ?? 'users';

        if (!$user_id || !$email || !$new_usertype || !$old_usertype) {
            echo json_encode(["success" => false, "message" => $error ?? "Invalid user data"]);
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
        $data = read_json_input();
        $error = null;
        $user_id = validate_int($data['user_id'] ?? null, 1);
        $lastname = sanitize_text($data['lastname'] ?? '', 100);
        $firstname = sanitize_text($data['firstname'] ?? '', 100);
        $birthday = sanitize_string($data['birthday'] ?? '', 10);
        $contact_number = sanitize_string($data['contact_number'] ?? '', 30);
        $newPassword = $data['password'] ?? ''; // Optional field for password change

        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User ID required"]);
            exit;
        }

        // Check if password change is requested
        if (!empty($newPassword)) {
            $plainPassword = validate_password_length($newPassword, $error);
            if (!$plainPassword) {
                echo json_encode(["success" => false, "message" => $error ?? "Invalid password"]);
                exit;
            }
            // Update all fields including password using secure hashing
            $hashedPassword = hashPassword($plainPassword);
            $stmt = $conn->prepare("UPDATE users SET lastname = ?, firstname = ?, birthday = ?, contact_number = ?, password = ? WHERE user_id = ?");
            $stmt->bind_param("sssssi", $lastname, $firstname, $birthday, $contact_number, $hashedPassword, $user_id);
        } else {
            // Update without password change
            $stmt = $conn->prepare("UPDATE users SET lastname = ?, firstname = ?, birthday = ?, contact_number = ? WHERE user_id = ?");
            $stmt->bind_param("ssssi", $lastname, $firstname, $birthday, $contact_number, $user_id);
        }

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
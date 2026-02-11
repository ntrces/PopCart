<?php
require 'cors_config.php';
header("Content-Type: application/json");

require 'db_connect.php';

// Include password utility functions for secure password hashing
require 'password_utils.php';
require 'input_utils.php';
require 'session_config.php';
require 'log_utils.php';

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
            $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
            $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
            
            if ($actor_id) {
                $old_label = ucfirst($old_usertype);
                $new_label = ucfirst($new_usertype);
                log_action($conn, $actor_id, $actor_role, "Updated {$old_label} {$user_id} to {$new_label}");
            }

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
            $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
            $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
            
            if ($actor_id) {
                $old_label = ucfirst($old_usertype);
                $new_label = ucfirst($new_usertype);
                log_action($conn, $actor_id, $actor_role, "Updated {$old_label} {$user_id} to {$new_label}");
            }

            echo json_encode(["success" => true, "message" => "User role changed successfully"]);
        }
        // Scenario 3: Buyer <-> Employee (staying in users table)
        else if (in_array($old_usertype, ['buyer', 'employee']) && in_array($new_usertype, ['buyer', 'employee'])) {
            $stmt = $conn->prepare("UPDATE users SET usertype = ? WHERE user_id = ?");
            $stmt->bind_param("si", $new_usertype, $user_id);

            if ($stmt->execute()) {
                $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
                $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
                
                if ($actor_id) {
                    $old_label = ucfirst($old_usertype);
                    $new_label = ucfirst($new_usertype);
                    log_action($conn, $actor_id, $actor_role, "Updated {$old_label} {$user_id} to {$new_label}");
                }

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
        
        // Track which fields were explicitly provided in the request
        $has_birthday_in_request = isset($data['birthday']) && $data['birthday'] !== '';
        $has_lastname_in_request = isset($data['lastname']) && $data['lastname'] !== '';
        $has_firstname_in_request = isset($data['firstname']) && $data['firstname'] !== '';
        $has_contact_in_request = isset($data['contact_number']) && $data['contact_number'] !== '';

        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User ID required"]);
            exit;
        }

        // Fetch original user data BEFORE update for change tracking
        $original_stmt = $conn->prepare("SELECT lastname, firstname, birthday, contact_number FROM users WHERE user_id = ?");
        $original_stmt->bind_param("i", $user_id);
        $original_stmt->execute();
        $original_result = $original_stmt->get_result();
        $original_row = $original_result->fetch_assoc();
        $original_stmt->close();

        // Check if password change is requested
        if (!empty($newPassword)) {
            $password_error = null;
            $plainPassword = validate_password_length($newPassword, $password_error);
            if (!$plainPassword) {
                // Don't expose password requirements (8-12 characters) - use generic message
                echo json_encode(["success" => false, "message" => "Invalid password"]);
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
            $actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
            $actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
            
            // If no session actor_id, use the user being updated (self-profile update)
            if (!$actor_id) {
                $actor_id = $user_id;
            }
            
            // Log each field change - ONLY if the field was explicitly provided in the request
            if ($original_row && $actor_id) {
                if ($has_lastname_in_request && $original_row['lastname'] !== $lastname) {
                    log_action($conn, $actor_id, $actor_role, "Updated last name to {$lastname}");
                }
                if ($has_firstname_in_request && $original_row['firstname'] !== $firstname) {
                    log_action($conn, $actor_id, $actor_role, "Updated first name to {$firstname}");
                }
                // Only log birthday if it was EXPLICITLY provided in the request (from MyProfile page update)
                if ($has_birthday_in_request && $original_row['birthday'] !== $birthday) {
                    log_action($conn, $actor_id, $actor_role, "Updated birthday to {$birthday}");
                }
                if ($has_contact_in_request && $original_row['contact_number'] !== $contact_number) {
                    log_action($conn, $actor_id, $actor_role, "Updated phone number to {$contact_number}");
                }
            }
            
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
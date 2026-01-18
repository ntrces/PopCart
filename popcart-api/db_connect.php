<?php
// Database credentials (Default XAMPP settings)
$host = "localhost";
$user = "root";      // Default username
$pass = "";          // Default password (usually blank, or 'root' if you set one)
$dbname = "popcart"; // Your database name

// Create connection (shared variable for backward compatibility)
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection and output an error if it fails
if ($conn->connect_error) {
    die(json_encode(array("success" => false, "message" => "Database Connection Failed: " . $conn->connect_error)));
}

// Helper function to return a mysqli connection (preferred by newer API files)
function db_connect() {
    global $conn;
    return $conn;
}
?>
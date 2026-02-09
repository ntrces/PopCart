<?php
function read_json_input(): array {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sanitize_string($value, ?int $maxLen = null): ?string {
    if ($value === null) {
        return null;
    }
    if (is_array($value) || is_object($value)) {
        return null;
    }
    $value = trim((string)$value);
    $value = preg_replace('/[[:cntrl:]]/', '', $value);
    if ($maxLen !== null && strlen($value) > $maxLen) {
        return null;
    }
    return $value;
}

function sanitize_text($value, ?int $maxLen = null): ?string {
    $value = sanitize_string($value, $maxLen);
    if ($value === null) {
        return null;
    }
    return strip_tags($value);
}

function escape_html($value): string {
    if ($value === null) {
        return '';
    }
    if (is_array($value) || is_object($value)) {
        return '';
    }
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}

function validate_email($email, ?string &$error = null): ?string {
    $email = sanitize_string($email);
    if ($email === null || $email === '' || strlen($email) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format.";
        return null;
    }
    return $email;
}

function validate_password_length($password, ?string &$error = null): ?string {
    if (!is_string($password)) {
        $password = '';
    }
    $password = trim($password);
    $length = strlen($password);
    if ($length < 8 || $length > 12) {
        $error = "Password must be 8-12 characters.";
        return null;
    }
    return $password;
}

function validate_int($value, int $min = 1, ?int $max = null): ?int {
    if ($value === null || $value === '') {
        return null;
    }
    $intVal = filter_var($value, FILTER_VALIDATE_INT);
    if ($intVal === false) {
        return null;
    }
    if ($intVal < $min) {
        return null;
    }
    if ($max !== null && $intVal > $max) {
        return null;
    }
    return $intVal;
}

function validate_float($value, ?float $min = null, ?float $max = null): ?float {
    if ($value === null || $value === '') {
        return null;
    }
    $floatVal = filter_var($value, FILTER_VALIDATE_FLOAT);
    if ($floatVal === false) {
        return null;
    }
    if ($min !== null && $floatVal < $min) {
        return null;
    }
    if ($max !== null && $floatVal > $max) {
        return null;
    }
    return $floatVal;
}

function validate_enum($value, array $allowed): ?string {
    $value = sanitize_string($value);
    if ($value === null) {
        return null;
    }
    return in_array($value, $allowed, true) ? $value : null;
}

/**
 * Rate limiting with exponential backoff to prevent brute force attacks
 * Checks for recent failed login attempts from the client IP
 * Returns delay in seconds that should be applied
 * 
 * @param mysqli $conn Database connection
 * @return int Number of seconds to sleep (0 if no delay needed)
 */
function get_brute_force_delay($conn): int {
    // Get client IP address
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    // Validate IP format
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = '127.0.0.1';
    }
    
    try {
        // Check for failed login attempts from this IP in the last 5 minutes
        // Look for failed login attempts (not successful ones)
        $time_window = date('Y-m-d H:i:s', time() - 300); // Last 5 minutes
        
        $stmt = $conn->prepare("
            SELECT COUNT(*) as failed_count 
            FROM logs 
            WHERE action LIKE 'Invalid%' 
            AND timestamp > ?
            AND user_id IN (
                SELECT user_id FROM (
                    SELECT DISTINCT ip_address as user_id FROM logs WHERE action = 'Login attempt'
                ) as temp
            )
            LIMIT 1
        ");
        
        // Simpler approach: count recent login attempts from this IP session
        // Use session to track failed attempts from this request origin
        if (!isset($_SESSION['login_attempts'])) {
            $_SESSION['login_attempts'] = [];
        }
        
        // Clean old attempts (older than 5 minutes)
        $_SESSION['login_attempts'] = array_filter(
            $_SESSION['login_attempts'],
            function($timestamp) { return (time() - $timestamp) < 300; }
        );
        
        $failed_attempts = count($_SESSION['login_attempts']);
        
        if ($failed_attempts === 0) {
            return 0; // No delay needed
        }
        
        // Exponential backoff: 2^(attempts-1) seconds, max 30 seconds
        // 1st attempt: 1 sec, 2nd: 2 sec, 3rd: 4 sec, 4th: 8 sec, 5th+: 30 sec
        $delay = min(30, 2 ** max(0, $failed_attempts - 1));
        
        return $delay;
    } catch (Exception $e) {
        error_log("Brute force check error: " . $e->getMessage());
        return 0; // Don't break login on error
    }
}

/**
 * Record a failed login attempt for rate limiting
 * This is called when login fails and helps trigger exponential backoff
 */
function record_failed_login_attempt(): void {
    if (!isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = [];
    }
    
    $_SESSION['login_attempts'][] = time();
}

/**
 * Reset login attempt counter on successful login
 */
function reset_login_attempts(): void {
    if (isset($_SESSION['login_attempts'])) {
        $_SESSION['login_attempts'] = [];
    }
}
?>

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
?>

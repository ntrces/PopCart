<?php
// Session authentication helper functions
// Include this in API endpoints that require authentication

function is_authenticated(): bool {
    return isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;
}

function require_auth(): void {
    if (!is_authenticated()) {
        http_response_code(401);
        exit;
    }
}

function get_session_user_id(): ?int {
    return $_SESSION['user_id'] ?? null;
}

function get_session_usertype(): ?string {
    return $_SESSION['usertype'] ?? null;
}

function get_session_email(): ?string {
    return $_SESSION['email'] ?? null;
}

function require_admin(): void {
    require_auth();
    $usertype = get_session_usertype();
    if (!in_array($usertype, ['admin', 'SuperAdmin'], true)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Forbidden. Admin access required."]);
        exit;
    }
}

function require_role(array $allowed_roles): void {
    require_auth();
    $usertype = get_session_usertype();
    if (!in_array($usertype, $allowed_roles, true)) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Forbidden. Insufficient permissions."]);
        exit;
    }
}
?>

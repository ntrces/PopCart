<?php
/**
 * Password Hashing Utility Functions
 * Uses ARGON2ID algorithm (recommended) for secure password hashing
 * Falls back to BCRYPT for backward compatibility
 */

/**
 * Hash a password using ARGON2ID algorithm
 * 
 * @param string $password The plain text password to hash
 * @return string The hashed password with algorithm info
 */
function hashPassword($password) {
    // ARGON2ID options (recommended over ARGON2I)
    $options = [
        'memory_cost' => 65536,  // 64MB - recommended for security
        'time_cost'   => 4,      // Number of iterations
        'threads'     => 2       // Number of parallel threads
    ];
    
    return password_hash($password, PASSWORD_ARGON2ID, $options);
}

/**
 * Verify a password against its hash
 * Works with both ARGON2ID and BCRYPT hashes (backward compatible)
 * 
 * @param string $password The plain text password to verify
 * @param string $hash The hashed password from database
 * @return bool True if password matches the hash
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Check if a password hash needs to be rehashed
 * This is useful for upgrading hash algorithms
 * 
 * @param string $hash The hashed password from database
 * @return bool True if the hash needs rehashing
 */
function passwordNeedsRehash($hash) {
    $options = [
        'memory_cost' => 65536,
        'time_cost'   => 4,
        'threads'     => 2
    ];
    
    return password_needs_rehash($hash, PASSWORD_ARGON2ID, $options);
}

?>

# PopCart Secure Password Hashing Implementation

## Overview
This document outlines the secure password hashing implementation used throughout the PopCart system. All user passwords are hashed using industry-standard algorithms with strong security parameters.

## Algorithm Used: ARGON2ID

### Why ARGON2ID?
- **More Secure**: ARGON2ID is memory-hard and resistant to GPU/ASIC attacks
- **Recommended**: Preferred over ARGON2I by security experts
- **Time & Resource Resistant**: Configurable iterations and memory costs
- **Backward Compatible**: PASSWORD_BCRYPT hashes can still be verified

### Hashing Parameters
```php
$options = [
    'memory_cost' => 65536,  // 64MB - recommended for security
    'time_cost'   => 4,      // 4 iterations
    'threads'     => 2       // 2 parallel threads
];
```

## Implementation Details

### Files Updated for Password Security:
1. **password_utils.php** - Central utility file with hashing functions
2. **signup_buyer.php** - Buyer registration (uses ARGON2ID)
3. **add_user.php** - Admin add user (uses ARGON2ID)
4. **signin.php** - User login verification (backward compatible)
5. **signin_admin.php** - Admin login verification (backward compatible)
6. **update_user.php** - Profile updates with password change support

### Core Functions

#### hashPassword($password)
Hashes a plaintext password using ARGON2ID algorithm.
```php
$hashedPassword = hashPassword($data["password"]);
```

#### verifyPassword($password, $hash)
Securely verifies a password against its hash. Works with both ARGON2ID and BCRYPT.
```php
if (verifyPassword($password, $user["password"])) {
    // Password is valid
}
```

#### passwordNeedsRehash($hash)
Checks if a password hash needs rehashing with current algorithms.
```php
if (passwordNeedsRehash($user["password"])) {
    // Rehash during next login
}
```

## Security Features

### 1. Prepared Statements
All database queries use parameterized queries to prevent SQL injection:
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
```

### 2. Password Verification
Uses PHP's native `password_verify()` which:
- Is timing-attack resistant
- Automatically handles different algorithm formats
- Returns safe boolean values

### 3. Login Attempt Tracking
Failed login attempts are tracked:
- After 3 failed attempts, user account is deactivated
- Successful login resets the counter

### 4. Account Status Checks
Inactive accounts cannot login regardless of correct password

## Usage Examples

### Registering a New User
```php
require 'password_utils.php';

$plainPassword = $data["password"];
$hashedPassword = hashPassword($plainPassword);

// Insert into database with $hashedPassword
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $usertype);
$stmt->execute();
```

### Verifying Login Credentials
```php
require 'password_utils.php';

$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (verifyPassword($password, $result["password"])) {
    // Login successful
} else {
    // Login failed
}
```

### Changing User Password
```php
if (!empty($newPassword)) {
    $hashedPassword = hashPassword($newPassword);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $stmt->bind_param("si", $hashedPassword, $user_id);
    $stmt->execute();
}
```

## Database Considerations

### Password Column Requirements
- **Type**: VARCHAR(255) minimum (recommended)
- **Size**: ARGON2ID hashes are approximately 95-100 characters
- **Collation**: utf8mb4_unicode_ci recommended

### Recommended Column Definition
```sql
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;
ALTER TABLE admins MODIFY COLUMN password VARCHAR(255) NOT NULL;
```

## Backward Compatibility

The system maintains backward compatibility with existing BCRYPT hashes:
- `verifyPassword()` works with both ARGON2ID and BCRYPT formats
- Old BCRYPT hashes will continue to work during login
- New registrations/updates use ARGON2ID

### Migration Strategy
When users login with old BCRYPT hashes:
1. `password_verify()` validates the password successfully
2. On next password change, new ARGON2ID hash is created
3. Gradual migration without forcing password resets

## Best Practices

### DO:
✅ Always use `hashPassword()` for new passwords
✅ Always use `verifyPassword()` for password verification
✅ Store hashed passwords, never plain text
✅ Use prepared statements for all queries
✅ Validate all user inputs
✅ Log failed login attempts
✅ Implement account lockout mechanisms
✅ Use HTTPS for all password transmission

### DON'T:
❌ Never hash passwords multiple times
❌ Never log or display passwords
❌ Never transmit passwords in URLs or logs
❌ Never use weak encryption algorithms
❌ Never use custom hash implementations
❌ Never trust client-side password validation alone
❌ Never store passwords without hashing

## Testing Password Security

### Test Hashing
```php
$password = "TestPassword123!";
$hash = hashPassword($password);
echo $hash; // Outputs: $argon2id$v=19$m=65536,t=4,p=2$...
```

### Test Verification
```php
$is_valid = verifyPassword("TestPassword123!", $hash); // true
$is_valid = verifyPassword("WrongPassword", $hash);    // false
```

## Troubleshooting

### Issue: "password_hash() not available"
**Solution**: Ensure PHP version is 5.5+ (recommended: 7.2+)

### Issue: Hash verification always fails
**Solution**: 
- Verify password column size is sufficient (VARCHAR(255))
- Check character encoding is UTF-8
- Ensure no trailing spaces in password hash

### Issue: ARGON2ID not available
**Solution**: 
- Ensure `password_argon2` extension is installed
- Check PHP version (PHP 7.2+)
- Update PHP if necessary

### Issue: Performance degradation during login
**Solution**:
- Memory-cost and time-cost parameters are correct
- Server has sufficient resources
- Consider load balancing if many concurrent logins

## Security Audit Checklist

- [ ] All password hashes use `password_hash()`
- [ ] All password verification uses `password_verify()`
- [ ] No plaintext passwords in logs
- [ ] Password column is VARCHAR(255)
- [ ] All queries use prepared statements
- [ ] Failed login attempts are tracked
- [ ] HTTPS is enforced for all authentication endpoints
- [ ] Password reset uses secure token mechanism
- [ ] Session management is secure
- [ ] Regular security audits are performed

## References

- [PHP Documentation: password_hash](https://www.php.net/manual/en/function.password-hash.php)
- [PHP Documentation: password_verify](https://www.php.net/manual/en/function.password-verify.php)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Argon2: Password Hashing Algorithm](https://github.com/P-H-C/phc-winner-argon2)

---
**Last Updated**: February 6, 2026
**Version**: 1.0
**Maintained By**: PopCart Development Team

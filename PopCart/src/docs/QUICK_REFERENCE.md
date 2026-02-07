# PopCart API - Secure Password Handling Quick Reference

## Quick Start

### Always Include This
```php
require 'password_utils.php';
```

### For New Passwords (Registration, Admin Creation, Password Change)
```php
$hashedPassword = hashPassword($plainTextPassword);
// Insert/Update: $hashedPassword into database
```

### For Verification (Login)
```php
if (verifyPassword($submittedPassword, $databaseHash)) {
    // Password is correct - Login successful
} else {
    // Password is incorrect - Login failed
}
```

---

## Common Patterns

### Pattern 1: User Registration
```php
<?php
require 'password_utils.php';
require 'db_connect.php';

// Get data from request
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$plainPassword = $data['password'];

// Hash the password
$hashedPassword = hashPassword($plainPassword);

// Insert into database
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashedPassword);
$stmt->execute();
?>
```

### Pattern 2: User Login
```php
<?php
require 'password_utils.php';
require 'db_connect.php';

// Get login data
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$submittedPassword = $data['password'];

// Get user from database
$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

// Verify password
if ($result && verifyPassword($submittedPassword, $result['password'])) {
    // Login successful
    echo json_encode(["success" => true]);
} else {
    // Login failed
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
?>
```

### Pattern 3: Password Change (Profile Update)
```php
<?php
require 'password_utils.php';
require 'db_connect.php';

// Get update data
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$newPassword = $data['password'] ?? null;

if ($newPassword) {
    // Hash new password
    $hashedPassword = hashPassword($newPassword);
    
    // Update with password
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $stmt->bind_param("si", $hashedPassword, $user_id);
} else {
    // Update without password change
    $stmt = $conn->prepare("UPDATE users SET name = ? WHERE user_id = ?");
    $stmt->bind_param("si", $data['name'], $user_id);
}

$stmt->execute();
?>
```

---

## Function Reference

### hashPassword($password)
**Purpose**: Hash a plaintext password for storage

**Parameters**:
- `$password` (string): The plaintext password to hash

**Returns**:
- (string): The hashed password (95-100 chars, starts with `$argon2id$`)

**Example**:
```php
$hash = hashPassword("MyPassword123");
// Returns: $argon2id$v=19$m=65536,t=4,p=2$...
```

---

### verifyPassword($password, $hash)
**Purpose**: Verify a password against its hash

**Parameters**:
- `$password` (string): The plaintext password to verify
- `$hash` (string): The stored hash from database

**Returns**:
- (bool): `true` if password matches, `false` otherwise

**Example**:
```php
$isValid = verifyPassword("MyPassword123", $storedHash);
if ($isValid) {
    // Password is correct
}
```

---

### passwordNeedsRehash($hash)
**Purpose**: Check if a hash needs to be updated to current algorithm

**Parameters**:
- `$hash` (string): The current password hash from database

**Returns**:
- (bool): `true` if hash should be updated, `false` otherwise

**Example**:
```php
// During login, check if we should upgrade old BCRYPT hash
if (passwordNeedsRehash($user['password'])) {
    // User entered correct password, so rehash with new algorithm
    $newHash = hashPassword($submittedPassword);
    $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $updateStmt->bind_param("si", $newHash, $user['user_id']);
    $updateStmt->execute();
}
```

---

## Security Do's and Don'ts

### ✅ DO
- `DO` hash all passwords before storing
- `DO` use `hashPassword()` for new passwords
- `DO` use `verifyPassword()` for checking passwords
- `DO` use prepared statements for database queries
- `DO` validate all user input
- `DO` use HTTPS for all authentication endpoints
- `DO` log failed login attempts
- `DO` implement rate limiting

### ❌ DON'T
- `DON'T` hash passwords multiple times
- `DON'T` use custom hash functions
- `DON'T` display passwords in error messages
- `DON'T` log plaintext passwords
- `DON'T` transmit passwords in URLs
- `DON'T` store passwords without hashing
- `DON'T` interpolate passwords into SQL queries
- `DON'T` email passwords to users

---

## Common Mistakes

### Mistake 1: Double Hashing
```php
// ❌ WRONG
$hash1 = password_hash($password, PASSWORD_ARGON2ID);
$hash2 = password_hash($hash1, PASSWORD_ARGON2ID);

// ✅ CORRECT
$hash = hashPassword($password);
```

### Mistake 2: Not Using Prepared Statements
```php
// ❌ WRONG
$sql = "SELECT * FROM users WHERE password = '$password'";
$result = $conn->query($sql);

// ✅ CORRECT
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
```

### Mistake 3: Password in Error Messages
```php
// ❌ WRONG
if (!verifyPassword($password, $hash)) {
    die("Wrong password: $password");
}

// ✅ CORRECT
if (!verifyPassword($password, $hash)) {
    die("Invalid credentials");
}
```

### Mistake 4: Storing Plaintext Passwords
```php
// ❌ WRONG
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $password);

// ✅ CORRECT
$hashedPassword = hashPassword($password);
$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hashedPassword);
```

---

## Testing Your Code

### Test 1: Hash Creation
```php
<?php
require 'password_utils.php';

$password = "TestPassword123!";
$hash = hashPassword($password);
var_dump($hash);  // Should output: string(95) "$argon2id$v=19$m=65536,t=4,p=2$..."
?>
```

### Test 2: Password Verification
```php
<?php
require 'password_utils.php';

$password = "TestPassword123!";
$hash = hashPassword($password);

var_dump(verifyPassword($password, $hash));          // true
var_dump(verifyPassword("WrongPassword", $hash));    // false
?>
```

### Test 3: Database Integration
```php
<?php
require 'password_utils.php';
require 'db_connect.php';

// Create test user
$email = 'test@example.com';
$password = 'TestPassword123!';
$hash = hashPassword($password);

$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $hash);
$stmt->execute();

// Verify it works
$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

var_dump(verifyPassword('TestPassword123!', $result['password']));  // true
?>
```

---

## Performance Notes

### Hash Generation Time
```
ARGON2ID: 50-100ms (one hash)
BCRYPT: 100-200ms (one hash)
```

### Hash Verification Time
```
ARGON2ID: 50-100ms per check
BCRYPT: 50-150ms per check
```

**Note**: Hash generation is intentionally slow to prevent brute force attacks. This is normal and expected.

---

## Troubleshooting

### "Call to undefined function hashPassword()"
**Fix**: Make sure you included password_utils.php at the top:
```php
require 'password_utils.php';
```

### "Password verification always fails"
**Check**:
1. Is the password column VARCHAR(255) or larger?
2. Are you using `verifyPassword()` not `==` or `===`?
3. Is the hash being truncated (check DB column size)?

### "Login is very slow"
**This is normal!** ARGON2ID is intentionally slow:
- Expected: 50-100ms per verification
- This is a security feature, not a bug
- Recommended: Accept the small delay for better security

---

## Files Using These Functions

- `signup_buyer.php` - Uses `hashPassword()`
- `add_user.php` - Uses `hashPassword()`
- `signin.php` - Uses `verifyPassword()`
- `signin_admin.php` - Uses `verifyPassword()`
- `update_user.php` - Uses `hashPassword()` for password changes

---

## External Resources

- [PHP password_hash Documentation](https://www.php.net/manual/en/function.password-hash.php)
- [PHP password_verify Documentation](https://www.php.net/manual/en/function.password-verify.php)
- [ARGON2 Algorithm Paper](https://github.com/P-H-C/phc-winner-argon2)
- [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

**Version**: 1.0  
**Last Updated**: February 6, 2026  
**Maintained By**: PopCart Development Team

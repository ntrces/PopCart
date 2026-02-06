# Input Validation and Sanitization

## Overview
Comprehensive input validation and sanitization has been implemented across all PopCart API endpoints to prevent SQL injection, XSS attacks, and data integrity issues.

## Security Features

### 1. **Input Validation Utilities** ([input_utils.php](../popcart-api/input_utils.php))

Helper functions for validating and sanitizing user input:

#### Input Reading
- `read_json_input()` - Safely read and decode JSON from request body

#### String Sanitization
- `sanitize_string($value, $maxLen)` - Remove control characters, enforce length limits
- `sanitize_text($value, $maxLen)` - Remove HTML tags (XSS protection)
- `escape_html($value)` - Escape HTML for safe output rendering

#### Validation Functions
- `validate_email($email, &$error)` - Validate email format (max 100 chars)
- `validate_password_length($password, &$error)` - Enforce 8-12 character password length
- `validate_int($value, $min, $max)` - Validate and type-cast integers
- `validate_float($value, $min, $max)` - Validate and type-cast floats
- `validate_enum($value, $allowed)` - Validate against allowed values list

### 2. **SQL Injection Prevention**

All database queries use **prepared statements with parameter binding** instead of manual string escaping:

```php
// Automatic SQL sanitization via prepared statements
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
```

This approach:
- ✅ Automatically escapes SQL special characters
- ✅ Type-safe (prevents type confusion attacks)
- ✅ Foolproof (no chance of forgetting to escape)
- ✅ Superior to `mysqli_real_escape_string()`

### 3. **XSS Protection**

Two-layer defense:

**Input Side (Storage):**
```php
$description = sanitize_text($input['description'], 2000);
// Removes HTML tags before storing in database
```

**Output Side (Display):**
```php
$safe_output = escape_html($user_bio);
// Escapes HTML entities when rendering to browser
```

## Validation Rules

### Email
- ✅ Valid email format (filter_var FILTER_VALIDATE_EMAIL)
- ✅ Maximum 100 characters
- ✅ Trimmed and sanitized

### Password
- ✅ Minimum 8 characters
- ✅ Maximum 12 characters
- ✅ Enforced on signup and password change

### Text Fields
- ✅ HTML tags stripped (XSS prevention)
- ✅ Control characters removed
- ✅ Length limits enforced
- ✅ Trimmed whitespace

### Numeric Fields
- ✅ Type validation (int/float)
- ✅ Range validation (min/max)
- ✅ Type casting for safety

### Enums/Status Fields
- ✅ Whitelist validation only
- ✅ Rejects invalid values

## Files Updated

### Core Utilities
- ✅ [input_utils.php](../popcart-api/input_utils.php) - Validation helper functions

### Authentication
- ✅ [signin.php](../popcart-api/signin.php) - Email/password validation
- ✅ [signin_admin.php](../popcart-api/signin_admin.php) - Email/password validation
- ✅ [signup_buyer.php](../popcart-api/signup_buyer.php) - Full user data validation
- ✅ [add_user.php](../popcart-api/add_user.php) - Admin user creation validation

### User Management
- ✅ [update_user.php](../popcart-api/update_user.php) - Profile update validation
- ✅ [update_user_status.php](../popcart-api/update_user_status.php) - Status enum validation

### Products
- ✅ [add_product.php](../popcart-api/add_product.php) - Product data validation
- ✅ [update_product.php](../popcart-api/update_product.php) - Price/stock validation
- ✅ [delete_product.php](../popcart-api/delete_product.php) - Product ID validation

### Addresses
- ✅ [add_address.php](../popcart-api/add_address.php) - Address field validation
- ✅ [delete_address.php](../popcart-api/delete_address.php) - ID validation
- ✅ [update_address_status.php](../popcart-api/update_address_status.php) - ID validation

### Orders
- ✅ [place_order.php](../popcart-api/place_order.php) - Order item validation
- ✅ [update_order_status.php](../popcart-api/update_order_status.php) - Status enum validation

## Usage Examples

### Example 1: Email Validation
```php
require 'input_utils.php';

$data = read_json_input();
$error = null;
$email = validate_email($data['email'] ?? '', $error);

if (!$email) {
    echo json_encode(["success" => false, "message" => $error]);
    exit;
}
```

### Example 2: Text Sanitization
```php
require 'input_utils.php';

$data = read_json_input();
$firstname = sanitize_text($data['firstname'] ?? '', 100);
$description = sanitize_text($data['description'] ?? '', 2000);

if (!$firstname) {
    echo json_encode(["success" => false, "message" => "Invalid name"]);
    exit;
}
```

### Example 3: Integer Validation
```php
require 'input_utils.php';

$user_id = validate_int($_POST['user_id'] ?? null, 1);
$quantity = validate_int($data['quantity'] ?? null, 1, 999);

if (!$user_id || !$quantity) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}
```

### Example 4: Enum Validation
```php
require 'input_utils.php';

$status = validate_enum($_POST['status'] ?? '', ['active', 'inactive']);
$usertype = validate_enum($data['usertype'] ?? '', ['buyer', 'employee', 'admin']);

if (!$status || !$usertype) {
    echo json_encode(["success" => false, "message" => "Invalid status or usertype"]);
    exit;
}
```

### Example 5: Output Escaping (Rendering to HTML)
```php
require 'input_utils.php';

// When displaying user-generated content
$safe_bio = escape_html($user['bio']);
echo "<div class='user-bio'>" . $safe_bio . "</div>";
```

## Security Benefits

| Attack Vector | Protection | Implementation |
|--------------|------------|----------------|
| SQL Injection | Prepared Statements | All endpoints with `bind_param()` |
| XSS (Stored) | Input Sanitization | `sanitize_text()` strips HTML |
| XSS (Reflected) | Output Escaping | `escape_html()` encodes entities |
| Data Validation | Type Checking | `validate_int()`, `validate_float()` |
| Length Overflow | Max Length | All sanitize/validate functions |
| Enum Injection | Whitelist | `validate_enum()` |
| Email Spoofing | Format Check | `validate_email()` with max 100 chars |
| Password Weakness | Length Enforcement | 8-12 chars required |

## Best Practices

1. **Always validate input** before using it
2. **Use validation helpers** instead of manual checks
3. **Check for null results** - validation functions return `null` on invalid input
4. **Provide error messages** - use the `&$error` parameter
5. **Sanitize on input** - clean data before storage
6. **Escape on output** - protect when rendering to HTML
7. **Never trust user input** - validate everything

## Testing Validation

Test with malicious inputs:
- SQL injection: `'; DROP TABLE users; --`
- XSS: `<script>alert('XSS')</script>`
- Path traversal: `../../../etc/passwd`
- Overflow: Very long strings (>1000 chars)
- Type confusion: `"1" vs 1 vs true`
- Boundary values: `-1`, `0`, `null`, empty string

All should be properly handled and rejected.

# SQL Injection Prevention (Prepared Statements)

## Overview
This document describes the SQL injection prevention strategy implemented across the PopCart system using **prepared statements with parameter binding**.

## What is SQL Injection?
SQL Injection is when an attacker inserts malicious SQL code into input fields to manipulate database queries.

### Vulnerable Example
```php
// ❌ VULNERABLE - String interpolation allows SQL injection
$email = $_POST['email'];
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);
// Attacker input: ' OR '1'='1
// Query becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
// This returns ALL users!
```

### Secure Example
```php
// ✅ SECURE - Prepared statement prevents injection
$email = $_POST['email'];
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);  // "s" = string type
$stmt->execute();
$result = $stmt->get_result();
// Attacker input is treated as literal data, not SQL code
```

## Implementation Strategy

### 1. **Prepared Statements (Primary Defense)**
All user input goes through parameterized queries using `prepare()` and `bind_param()`:

```php
// Template with ? placeholders
$stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? AND role = ?");

// Bind data - type must match: "i"=int, "s"=string, "d"=double, "b"=blob
$stmt->bind_param("is", $userId, $role);

// Execute with bound parameters
$stmt->execute();
$result = $stmt->get_result();
```

### 2. **Data Type Safety**
The type specifier in `bind_param()` ensures type safety:
- `"i"` = Integer (1, 100, -50)
- `"s"` = String ('email@test.com', 'product name')
- `"d"` = Double (3.14, 99.99)
- `"b"` = Blob (binary data, file contents)

### 3. **Input Validation (Second Line of Defense)**
Before using input, validate it with `input_utils.php`:

```php
require 'input_utils.php';

$email = validate_email($_POST['email'] ?? '');
if (!$email) {
    echo json_encode(["success" => false, "message" => "Invalid email"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
```

## Updated Files (Prepared Statements)

### Statistics & Reports
- ✅ `get_dashboard_stats.php` - Status counts with prepared statements
- ✅ `get_weekly_stats.php` - Date parameters with prepared statements
- ✅ `get_monthly_stats.php` - Year parameter with prepared statements
- ✅ `get_yearly_stats.php` - Year parameter with prepared statements

### User Management
- ✅ `get_user.php` - User ID with prepared statement
- ✅ `get_users.php` - Static query (no parameters needed)
- ✅ `get_user_count.php` - Static query (no parameters needed)
- ✅ `get_user_counts.php` - Static query (no parameters needed)

### Product Management
- ✅ `get_product.php` - Product ID with prepared statement
- ✅ `get_products.php` - Static query (no parameters needed)
- ✅ `get_product_count.php` - Static query (no parameters needed)
- ✅ `get_featured_products.php` - Static query (no parameters needed)

### Order Management
- ✅ `get_orders.php` - User ID with prepared statement
- ✅ `get_order_products.php` - Order ID with prepared statement
- ✅ `get_order_stats.php` - User ID with prepared statements
- ✅ `get_all_orders.php` - Mixed (static + prepared statements)

### Address Management
- ✅ `get_addresses.php` - User ID with prepared statement

### Modification Endpoints
- ✅ `add_user.php` - All parameters with prepared statements
- ✅ `add_product.php` - All parameters with prepared statements
- ✅ `add_address.php` - All parameters with prepared statements
- ✅ `update_user.php` - All parameters with prepared statements
- ✅ `update_product.php` - All parameters with prepared statements
- ✅ `update_address_status.php` - All parameters with prepared statements
- ✅ `update_order_status.php` - All parameters with prepared statements
- ✅ `delete_product.php` - Product ID with prepared statement
- ✅ `delete_address.php` - Address ID with prepared statement

### Authentication
- ✅ `signin.php` - Email with prepared statement
- ✅ `signin_admin.php` - Email with prepared statement
- ✅ `signup_buyer.php` - All user data with prepared statements
- ✅ `place_order.php` - All order data with prepared statements

## Bind Parameter Types

| Type | PHP Data Type | SQL Type | Example |
|------|---------------|----------|---------|
| `"i"` | Integer | INT | `$stmt->bind_param("i", $user_id)` |
| `"s"` | String | VARCHAR | `$stmt->bind_param("s", $email)` |
| `"d"` | Double | DECIMAL | `$stmt->bind_param("d", $price)` |
| `"b"` | Blob | BLOB | `$stmt->bind_param("b", $image)` |

## Multiple Parameters

When binding multiple parameters, concatenate types and pass in order:

```php
$stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE user_id = ?");
$stmt->bind_param("sssi", $firstname, $lastname, $email, $user_id);
//                "sssi" = 3 strings + 1 integer
$stmt->execute();
```

## Best Practices

### ✅ DO:
- **Always use prepared statements** for parameterized data
- **Validate and sanitize** input before using (defense-in-depth)
- **Use appropriate type specifiers** ("i" for integers, "s" for strings)
- **Check prepare() errors** - use `if ($stmt === false)` before bind_param
- **Close statements** after use - `$stmt->close()`

### ❌ DON'T:
- **Never concatenate user input** into SQL strings
- **Don't use printf/sprintf** for SQL query construction
- **Don't trust the data type** - validate before using
- **Don't skip prepared statements** even for "simple" queries
- **Don't expose query errors** - log them server-side only

## Error Handling

Always check if prepare() succeeded:

```php
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
    // Log the actual error server-side only
    error_log("SQL Error: " . $conn->error);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
```

## Protection Against Common Attack Vectors

### Attack 1: Boolean-Based Injection
```
Input: ' OR '1'='1
Vulnerable Query: SELECT * FROM users WHERE email = '' OR '1'='1'
With Prepared Statement: Treated as literal string, attack fails ✅
```

### Attack 2: Time-Based Blind Injection
```
Input: ' OR SLEEP(5) --
Vulnerable Query: SELECT * FROM users WHERE email = '' OR SLEEP(5) --'
With Prepared Statement: Treated as literal string, attack fails ✅
```

### Attack 3: Union-Based Injection
```
Input: ' UNION SELECT NULL,NULL,NULL --
Vulnerable Query: SELECT id, name FROM users WHERE email = '' UNION SELECT NULL,NULL,NULL --'
With Prepared Statement: Treated as literal string, attack fails ✅
```

## Verification Checklist

- [x] All user input parameters use `?` placeholders
- [x] All parameters bound with `bind_param()` before execution
- [x] Correct type specifiers used ("i", "s", "d", etc.)
- [x] Error checking on `prepare()` calls
- [x] Statements properly closed after use
- [x] Input validation performed before database operations
- [x] No string concatenation in SQL queries
- [x] No interpolation of variables into query strings

## Testing

Test with injection payloads to verify protection:

```
Payloads to test:
- ' OR '1'='1
- '; DROP TABLE users; --
- ' UNION SELECT * FROM users --
- ' OR 1=1 --
- admin'--
- ' AND SLEEP(5) --
```

All should be rejected or treated as literal data.

## Related Documentation

- [INPUT_VALIDATION.md](INPUT_VALIDATION.md) - Input validation helpers
- [SESSION_SECURITY.md](SESSION_SECURITY.md) - Session/authentication security
- [PASSWORD_SECURITY.md](PASSWORD_SECURITY.md) - Password hashing
- [README.md](README.md) - Security overview

## Support & Updates

For new endpoints:
1. Always use prepared statements
2. Validate all input with `input_utils.php`
3. Use appropriate type specifiers
4. Handle errors gracefully
5. Never expose SQL errors to users

---

**Last Updated:** February 7, 2026  
**Status:** ✅ All SQL injection prevention implemented

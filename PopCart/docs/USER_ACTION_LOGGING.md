# User Action Logging Implementation

## Summary

The application properly logs all user actions with their **usertype** recorded at the time of the action. When a user is logged in and makes changes, their session `usertype` is captured and recorded in the `logs` table.

## How It Works

### 1. Login Process
When a user signs in successfully:
```php
// From signin.php or signin_admin.php
$_SESSION['user_id'] = $user["user_id"];
$_SESSION['usertype'] = $user["usertype"];  // ✅ Stored in session
$_SESSION['email'] = $user["email"];
$_SESSION['authenticated'] = true;
```

### 2. Action Performance
When a user performs an action (add product, place order, update user, etc.):
- API endpoint is called (e.g., `/add_product.php`, `/place_order.php`)
- Endpoint retrieves the usertype from the **current session**:
```php
$actor_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
$actor_role = isset($_SESSION['usertype']) ? $_SESSION['usertype'] : null;
```

### 3. Logging the Action
The retrieved usertype is passed to the logging function:
```php
log_action($conn, $actor_id, $actor_role, "Updated product {$product_id}");
```

### 4. Database Recording
The `log_action()` function records the action in the `logs` table:
```php
INSERT INTO logs (user_id, role, action) VALUES (?, ?, ?)
```

**Result**: The `role` column contains the user's usertype at the time of the action.

## Endpoints That Log Actions With Usertype

| File | Action Logged | Usertype Source |
|------|---------------|-----------------|
| **signin.php** | Logged in | `$user["usertype"]` from DB query |
| **signin_admin.php** | Logged in | `$user["usertype"]` from DB query |
| **logout.php** | Signed out | `$_SESSION['usertype']` from session |
| **signup_buyer.php** | Signed up | Hardcoded as 'buyer' (correct) |
| **add_product.php** | Added product | `$_SESSION['usertype']` from session |
| **delete_product.php** | Deleted product | `$_SESSION['usertype']` from session |
| **update_product.php** | Updated product details | `$_SESSION['usertype']` from session |
| **place_order.php** | Placed order | `$_SESSION['usertype']` from session |
| **update_order_status.php** | Updated order status | `$_SESSION['usertype']` from session |
| **add_user.php** | Added user/admin | `$_SESSION['usertype']` from session |
| **update_user.php** | Updated user profile | `$_SESSION['usertype']` from session |
| **update_user_status.php** | Activated/Deactivated user | `$_SESSION['usertype']` from session |
| **update_address_status.php** | Updated address | `$_SESSION['usertype']` from session |

## Fallback Logic (in log_utils.php)

If the usertype is not provided to `log_action()` (rare case):
1. **Primary Priority**: Use provided `$role` parameter (from `$_SESSION['usertype']`)
2. **Fallback 1**: Look up usertype from `admins` table
3. **Fallback 2**: Look up usertype from `users` table
4. **Fallback 3**: Default to `'buyer'` (if all lookups fail)

**Note**: The fallback is mainly needed during logout when the session is already being destroyed.

## Examples of Logged Actions

### Example 1: Buyer Places Order
```
User logs in as: buyer (user_id=5)
Session['usertype'] = 'buyer'
User places order
log_action($conn, 5, 'buyer', "Placed the order 42");
```
**Logged Entry**: `user_id=5, role='buyer', action='Placed the order 42'`

### Example 2: Employee Updates Product
```
User logs in as: employee (user_id=8)
Session['usertype'] = 'employee'
User updates product stock
log_action($conn, 8, 'employee', "Updated the stock of product 15 to 50");
```
**Logged Entry**: `user_id=8, role='employee', action='Updated the stock of product 15 to 50'`

### Example 3: Admin Deactivates User
```
User logs in as: admin (user_id=3)
Session['usertype'] = 'admin'
Admin deactivates a user account
log_action($conn, 3, 'admin', "Deactivated buyer 12");
```
**Logged Entry**: `user_id=3, role='admin', action='Deactivated buyer 12'`

## Usertype Values

The system recognizes these usertypes:
- **`buyer`** - Regular e-commerce customer
- **`employee`** - Product/order management staff
- **`admin`** - System administrator with full access
- **`SuperAdmin`** - (if applicable) Super administrator

## Database Schema

The `logs` table structure:
```sql
CREATE TABLE logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role VARCHAR(20),          -- Stores the usertype
    action VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX(user_id),
    INDEX(role),
    INDEX(timestamp)
);
```

## Verification

To verify user actions are being logged correctly:

1. **Check logs after user action**:
```sql
SELECT * FROM logs 
WHERE user_id = 5 
ORDER BY timestamp DESC 
LIMIT 10;
```

2. **Verify usertype is recorded**:
```sql
SELECT user_id, role, action, timestamp 
FROM logs 
WHERE role = 'buyer'
ORDER BY timestamp DESC;
```

3. **Check admin actions**:
```sql
SELECT user_id, role, action, timestamp 
FROM logs 
WHERE role IN ('admin', 'SuperAdmin')
ORDER BY timestamp DESC;
```

## Security Considerations

1. **Session-Based Recording**: Usertype is recorded from the active session, ensuring it reflects the user's actual role at the time of action
2. **Immutable Logs**: Once logged, the action and usertype cannot be modified (audit trail integrity)
3. **Authentication Required**: Protected routes ensure only authenticated users can trigger loggable actions
4. **Proper Cleanup**: Session is destroyed on logout, preventing unauthorized actions appearing as if made by that user

## Debugging

If you suspect logging issues, check:
1. **Debug Log**: `/popcart-api/logout_debug.log` contains detailed logging information
2. **Session State**: Ensure `$_SESSION['usertype']` is set after login
3. **Database Connection**: Verify logs table exists and is accessible
4. **User Authentication**: Confirm user passed `require_auth()` check on protected endpoints

## Implementation Checklist

✅ All API endpoints that perform actions capture `$_SESSION['usertype']`
✅ `log_action()` function accepts usertype parameter
✅ Usertype is stored in logs table
✅ Session usertype is set during login
✅ Session usertype is cleared during logout
✅ Fallback lookup queries are in place for edge cases
✅ Debug logging is enabled for troubleshooting
✅ All user actions are properly recorded with usertype

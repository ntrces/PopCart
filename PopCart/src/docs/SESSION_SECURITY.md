# Session Security Implementation

## Overview
Secure session management has been integrated into the PopCart API to provide an additional layer of security beyond the existing localStorage-based authentication.

## Security Features

### 1. **Secure Session Configuration** ([session_config.php](../popcart-api/session_config.php))
- **HttpOnly cookies**: Prevents JavaScript access (XSS protection)
- **SameSite=Strict**: Prevents CSRF attacks
- **Session regeneration**: ID regenerated every 30 minutes (prevents session fixation)
- **Secure cookie name**: Custom session name for additional obscurity

### 2. **Authentication Helpers** ([auth_helpers.php](../popcart-api/auth_helpers.php))
Helper functions for endpoint protection:
- `is_authenticated()` - Check if user is logged in
- `require_auth()` - Require authentication, return 401 if not
- `require_admin()` - Require admin role, return 403 if not
- `require_role(['buyer', 'employee'])` - Require specific roles
- `get_session_user_id()` - Get current user ID
- `get_session_usertype()` - Get current user role
- `get_session_email()` - Get current user email

## Updated Files

### Authentication Endpoints
- ✅ [signin.php](../popcart-api/signin.php) - Stores user data in session on successful login + **prevents page caching**
- ✅ [signin_admin.php](../popcart-api/signin_admin.php) - Stores admin data in session on successful login + **prevents page caching**
- ✅ [logout.php](../popcart-api/logout.php) - Destroys session and cookies + **prevents page caching**
- ✅ [verify_session.php](../popcart-api/verify_session.php) - Check current session status + **prevents page caching**
- ✅ [session_config.php](../popcart-api/session_config.php) - Sets cache-control headers to prevent back navigation after logout

### React Client-Side Protection
- ✅ [authUtils.js](../utils/authUtils.js) - Logout and auth helper functions
- ✅ [useAuthHooks.js](../utils/useAuthHooks.js) - React hooks for route protection
- ✅ [PREVENT_BACK_NAVIGATION.md](PREVENT_BACK_NAVIGATION.md) - Implementation guide

## How to Protect Endpoints

### Basic Protection (Any Authenticated User)
```php
<?php
require 'session_config.php';
require 'auth_helpers.php';

// Protect endpoint - require any authenticated user
require_auth();

// Your endpoint logic here
$user_id = get_session_user_id();
```

### Admin-Only Protection
```php
<?php
require 'session_config.php';
require 'auth_helpers.php';

// Protect endpoint - require admin role
require_admin();

// Your admin-only logic here
```

### Role-Based Protection
```php
<?php
require 'session_config.php';
require 'auth_helpers.php';

// Protect endpoint - require specific roles
require_role(['employee', 'admin']);

// Your logic here
```

## Session Data Stored

On successful login, the following data is stored in `$_SESSION`:
- `user_id` - User's database ID
- `usertype` - User role (buyer/employee/admin/SuperAdmin)
- `email` - User's email
- `source_table` - Database table (users/admins)
- `authenticated` - Boolean flag
- `created` - Session creation timestamp (for regeneration)

## Production Configuration

**Important:** Before deploying to production with HTTPS:

Edit [session_config.php](../popcart-api/session_config.php) line 11:
```php
'secure' => true,  // Change from false to true for HTTPS
```

## Current Architecture Note

The React frontend currently uses **localStorage** for authentication. This session implementation:
- ✅ Works alongside the existing localStorage auth
- ✅ Provides server-side session security
- ✅ Stores user data in httpOnly cookies (inaccessible to JavaScript)
- ⚠️ For full benefit, the React app should migrate from localStorage to session cookies

## Security Benefits

| Feature | localStorage (Current) | Sessions (New) |
|---------|----------------------|----------------|
| XSS Protection | ❌ Vulnerable | ✅ Protected (httpOnly) |
| CSRF Protection | ❌ None | ✅ SameSite=Strict |
| Session Fixation | N/A | ✅ Auto-regeneration |
| Server-side Control | ❌ None | ✅ Full control |
| Back Button After Logout | ⚠️ Shows cached pages | ✅ Prevented (no-cache headers) |

## Back Navigation Prevention

After logout, users cannot use the browser's back button to access cached authenticated pages:

**PHP Side (Server):**
- All auth endpoints send `Cache-Control: no-store, no-cache` headers
- Browsers won't cache authenticated pages
- Implemented in [session_config.php](../popcart-api/session_config.php)

**React Side (Client):**
- Use `useAuthProtection()` hook on protected pages
- Use `handleLogout()` for logout buttons
- See complete guide: [PREVENT_BACK_NAVIGATION.md](PREVENT_BACK_NAVIGATION.md)

## Testing

Test session authentication:
1. Login via [signin.php](../popcart-api/signin.php) or [signin_admin.php](../popcart-api/signin_admin.php)
2. Check session: [verify_session.php](../popcart-api/verify_session.php)
3. Logout: [logout.php](../popcart-api/logout.php)

## Endpoints to Update (Optional)

For maximum security, consider adding session verification to:
- User profile endpoints
- Order placement/management
- Product management (admin)
- User management (admin)
- Address management

Example integration shown in files above.

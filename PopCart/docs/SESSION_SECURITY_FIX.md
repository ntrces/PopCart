# Session Security & Logout Implementation

## Problem Identified
Users could access internal pages without logging in, and sessions were not being properly destroyed after logout or browser close. This was a critical security vulnerability.

## Root Causes Fixed

### 1. **Missing Route Protection** 
**Problem**: All internal routes were directly accessible without authentication
- Admin routes (`/admin`, `/admin/users`, `/admin/products`, etc.) were not protected
- Buyer routes (`/buyer`, `/buyer/cart`, `/buyer/orders`, etc.) were not protected  
- Employee routes (`/employee/products`, `/employee/orders`) were not protected

**Solution**: Wrapped all internal routes with `ProtectedRoute` component in [App.jsx](../src/App.jsx)
```jsx
<Route path="/buyer" element={
  <ProtectedRoute allowedRoles={["buyer"]}>
    <Home />
  </ProtectedRoute>
} />
```

### 2. **No Server-Side Session Verification on Route Access**
**Problem**: Protected routes only checked in-memory `user` state from AuthContext, ignoring the actual server-side session

**Solution**: Enhanced [ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx) to:
- Call `verify_session.php` on every route access
- Verify session validity with the server before allowing access
- Redirect to signin if server returns 401 Unauthorized
- Show loading state while verifying session

### 3. **Session Cookie Not Using Strict SameSite**
**Problem**: Session cookie used `SameSite='Lax'` which is less secure

**Solution**: Changed [session_config.php](../src/popcart-api/session_config.php) to use `SameSite='Strict'`:
```php
'samesite' => 'Strict'  // Maximum security against CSRF
```

### 4. **Inadequate Session Destruction**
**Problem**: `logout.php` did not properly clear session cookies

**Solution**: Enhanced [logout.php](../src/popcart-api/logout.php) to:
- Clear all session variables with `$_SESSION = []`
- Properly delete session cookie with maxage -3600
- Call `session_destroy()` to remove session data
- Handle both request body and session fallback for user_id

### 5. **Session Cookie Lifetime Not Server-Optimized**
**Problem**: No automatic cleanup of expired sessions server-side

**Solution**: Configured [session_config.php](../src/popcart-api/session_config.php) with:
```php
ini_set('session.gc_maxlifetime', 86400);  // Cleanup after 24 hours
ini_set('session.gc_probability', 1);       
ini_set('session.gc_divisor', 100);         // Aggressive cleanup
```

## Implementation Details

### Protected Route Flow
1. User navigates to protected route (e.g., `/buyer/cart`)
2. ProtectedRoute component:
   - Checks if app is still loading session (`isChecking`)
   - Calls `verify_session.php` to verify server-side session
   - Waits for response
   - If 401 Unauthorized → Redirects to `/signin`
   - If valid → Shows protected component
   - If any other error → Redirects to `/signin`

### Logout Flow (Manual)
1. User clicks logout button
2. Frontend calls `logout()` from AuthContext:
   - Sends POST to `logout.php` with user_id
   - Server destroys session
   - Frontend clears localStorage, sessionStorage
   - Sets `logout_event` flag to notify other tabs
   - Redirects to home page

### Logout Flow (Browser Close)
1. User closes browser tab
2. `beforeunload` event listener triggers:
   - Sends logout request via `fetch` with `keepalive: true`
   - Sets `logout_event` flag
   - Server destroys session
   - Session cookie expires (lifetime=0)

### Cross-Tab Logout Detection
- AuthContext listens to `storage` events
- When another tab sets `logout_event`, all tabs detect it
- All tabs clear local auth state and redirect to signin

## Security Features Implemented

| Feature | Implementation |
|---------|------------------|
| **Session Cookie Lifetime** | Set to 0 (expires on browser close) |
| **HttpOnly Flag** | Enabled (prevents JavaScript access via XSS) |
| **SameSite Policy** | Set to Strict (prevents CSRF attacks) |
| **Session Verification** | On every protected route access |
| **Session Destruction** | Immediate on logout, on browser close |
| **Cross-Tab Sync** | Storage events notify all tabs |
| **Automatic Cleanup** | Server-side GC every 1/100 requests |
| **Cache Prevention** | All responses include `Cache-Control` headers |

## Files Modified

1. **[src/App.jsx](../src/App.jsx)** - Added ProtectedRoute wrapper to all internal routes
2. **[src/routes/ProtectedRoute.jsx](../src/routes/ProtectedRoute.jsx)** - Added server-side session verification
3. **[src/auth/AuthContext.jsx](../src/auth/AuthContext.jsx)** - Enhanced session handling, cross-tab logout detection
4. **[src/popcart-api/session_config.php](../src/popcart-api/session_config.php)** - Changed SameSite to Strict, added GC config
5. **[src/popcart-api/logout.php](../src/popcart-api/logout.php)** - Enhanced session destruction
6. **[src/popcart-api/verify_session.php](../src/popcart-api/verify_session.php)** - Better CORS handling

## Testing Checklist

- [ ] Log in as a buyer / employee / admin
- [ ] Close the browser tab completely
- [ ] Open browser again and try to access internal page (should redirect to signin)
- [ ] Try accessing internal page URL directly without login (should redirect to signin)
- [ ] Log in on Tab 1, close Tab 1, try accessing internal page on Tab 2 (should redirect to signin)
- [ ] Log in and click logout button (should clear session)
- [ ] Try going back after logout (browser should not remember session)
- [ ] Check that only these pages are accessible without login:
  - `/` (landing page)
  - `/landing` (landing page)
  - `/signin` (buyer signin)
  - `/signup-buyer` (buyer signup)
  - `/admin/signin` (admin signin)

## Session Files Location
- **Session data storage**: `C:\xampp\tmp\` (Windows) - Contains session files created by PHP
- **Debug log**: `src/popcart-api/logout_debug.log` - Track logout events

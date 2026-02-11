# Signin & Protected Routes Test Guide

## Summary of Changes

The signin flow now works correctly with protected routes:

1. **User signs in** → credentials sent to `signin.php`
2. **Server creates session** → session cookie set with `credentials: include`
3. **Frontend stores user data** → saved to localStorage
4. **User navigated** → to `/buyer` or `/employee` based on usertype
5. **ProtectedRoute verifies** → calls `verify_session.php` on each protected route
6. **Server validates session** → returns user data if session is valid, 401 if not
7. **Component loads or redirects** → based on session validity and user roles

## Key Fix

Fixed a critical bug in `ProtectedRoute.jsx`:
- **Before**: Would check `if (user && !isChecking)` where `user` is from AuthContext
- **Issue**: After signin, AuthContext user is still null (only updates on app load), so route would immediately redirect without checking server
- **After**: Now calls `verify_session.php` regardless of AuthContext user state
- **Result**: Server session is the source of truth, not the client state

## Test Scenarios

### Test 1: Buyer Signin Flow ✅
1. Navigate to `http://localhost:5173/signin`
2. Enter valid buyer credentials:
   - Email: [any registered buyer email]
   - Password: [correct password]
3. Click "Sign In"
4. **Expected Result**: 
   - Should navigate to `/buyer` page
   - Page should load without redirect
   - Can access other buyer pages (`/buyer/cart`, `/buyer/marketplace`, etc.)

### Test 2: Employee Signin Flow ✅
1. Navigate to `http://localhost:5173/signin`
2. Enter valid employee credentials:
   - Email: [any registered employee email]
   - Password: [correct password]
3. Click "Sign In"
4. **Expected Result**:
   - Should navigate to `/employee/products` page
   - Page should load without redirect
   - Can access other employee pages (`/employee/orders`)

### Test 3: Admin Signin Flow ✅
1. Navigate to `http://localhost:5173/admin/signin`
2. Enter valid admin credentials:
   - Email: [admin email]
   - Password: [correct password]
3. Click "Sign In"
4. **Expected Result**:
   - Should navigate to `/admin` dashboard
   - Page should load without redirect
   - Can access other admin pages (`/admin/users`, `/admin/products`, etc.)

### Test 4: Unauthorized Access Prevention ✅
1. **Do NOT sign in**
2. Try to access:
   - `http://localhost:5173/buyer` → Should redirect to `/signin`
   - `http://localhost:5173/buyer/cart` → Should redirect to `/signin`
   - `http://localhost:5173/employee/products` → Should redirect to `/signin`
   - `http://localhost:5173/admin` → Should redirect to `/signin`
3. **Expected Result**: All internal routes should redirect to signin
4. **Expected for Public Routes**:
   - `http://localhost:5173/` → Loads (Landing page)
   - `http://localhost:5173/signin` → Loads (Signin page)
   - `http://localhost:5173/signup-buyer` → Loads (Signup page)
   - `http://localhost:5173/admin/signin` → Loads (Admin signin page)

### Test 5: Role-Based Access Control ✅
1. Sign in as **Buyer**
2. Try to navigate to:
   - `/employee/products` → Should redirect to home
   - `/admin/users` → Should redirect to home
3. Sign in as **Employee**
4. Try to navigate to:
   - `/buyer/cart` → Should redirect to home
   - `/admin/dashboard` → Should redirect to home
5. Sign in as **Admin**
6. Try to navigate to:
   - `/buyer/marketplace` → Should redirect to home
   - `/employee/orders` → Should redirect to home
7. **Expected Result**: Users can only access pages for their role

### Test 6: Session Persistence ✅
1. Sign in as a user
2. Navigate to multiple pages (stay in same role)
3. Close browser tab
4. Open browser again
5. Navigate directly to `http://localhost:5173/buyer` (or employee/admin)
6. **Expected Result**: Should redirect to `/signin` (session expired)

### Test 7: Cross-Tab Logout ✅
1. Open two browser tabs
2. In Tab 1: Sign in as buyer
3. In Tab 1: Navigate to `/buyer/cart`
4. In Tab 2: Navigate to `http://localhost:5173/buyer/cart`
5. **Expected Result**: Tab 2 should redirect to signin (not the same user session)
6. In Tab 1: Click Logout button
7. **Result**: Tab 2 should detect logout and redirect to signin

## Protected Routes by Role

### Public Routes (No Login Required)
- `/` - Landing page
- `/landing` - Landing page
- `/signin` - Buyer Signin
- `/signup-buyer` - Buyer Signup
- `/admin/signin` - Admin Signin

### Buyer Routes (Requires Login as 'buyer')
- `/buyer` - Home
- `/buyer/marketplace` - Marketplace
- `/buyer/cart` - Shopping Cart
- `/buyer/orders` - My Orders
- `/buyer/profile` - Profile
- `/buyer/notifications` - Notifications

### Employee Routes (Requires Login as 'employee')
- `/employee/products` - Product Management
- `/employee/orders` - Order Management

### Admin Routes (Requires Login as 'admin' or 'SuperAdmin')
- `/admin` - Dashboard
- `/admin/users` - User Management
- `/admin/products` - Product Management
- `/admin/orders` - Order Management
- `/admin/audit` - Audit Logs

## Debugging

If you encounter issues, check the browser console (F12):

1. **Network Tab**: Verify that `verify_session.php` is being called
   - Should show a GET request with `credentials: include`
   - Status should be 200 if session is valid, 401 if not

2. **Console Tab**: Check for any error messages
   - Session verification errors will be logged
   - Redirect reasons will be logged

3. **Application Tab**: Check cookies and storage
   - `POPCART_SESSION` cookie should exist after login
   - Cookie should have `HttpOnly` flag
   - `localStorage` should have `user` data after login

## How It Works

```
User Signs In
    ↓
signin.php validates credentials
    ↓
Server creates session (cookie set)
    ↓
Server returns user data
    ↓
Frontend stores to localStorage
    ↓
Frontend navigates to /buyer or /employee
    ↓
ProtectedRoute mounts (on /buyer or /employee)
    ↓
ProtectedRoute calls verify_session.php
    ↓
Server checks session validity
    ↓
If Valid (200 OK) → Load page component
If Invalid (401) → Redirect to /signin
    ↓
Component renders with user data
```

## Important Notes

- **Session Cookie Lifetime**: Set to 0 (expires when browser closes)
- **HttpOnly**: Enabled (prevents JavaScript access)
- **SameSite**: Strict (prevents CSRF attacks)
- **Server Verification**: Happens on EVERY protected route access
- **Source of Truth**: Server session, not localStorage or AuthContext

This ensures maximum security and prevents any session manipulation on the client side.

// Logout utility with back button prevention
// Note: Use AuthContext.logout() instead - this is deprecated
export const handleLogout = (navigate) => {
  // Navigate to signin and replace history
  navigate('/signin', { replace: true });
  
  // Prevent back button by clearing forward history
  window.history.pushState(null, '', window.location.href);
  window.history.pushState(null, '', window.location.href);
  window.history.back();
  window.history.forward();
  
  // Add event listener to prevent back navigation
  window.addEventListener('popstate', preventBackNavigation);
};

// Prevent back navigation after logout
const preventBackNavigation = () => {
  // Note: ProtectedRoute will verify session server-side
  window.history.pushState(null, '', window.location.href);
  window.history.forward();
};

// Initialize back button prevention on auth pages
export const initializeAuthProtection = () => {
  // Push initial state
  window.history.pushState(null, '', window.location.href);
  
  // Listen for back button
  const handlePopState = () => {
    // Note: ProtectedRoute will handle session verification
    // Just prevent back navigation for UX
    window.history.pushState(null, '', window.location.href);
    window.history.forward();
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};

// Check if user is authenticated
// Note: Deprecated - use AuthContext hook instead
export const isAuthenticated = () => {
  // Always verify with server via ProtectedRoute
  return false;
};

// Verify session is still valid (optional - requires session endpoint)
export const verifySession = async () => {
  try {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const apiBase = `${protocol}//${host}/PopCart1/PopCart/PopCart/src/popcart-api`;
    const response = await fetch(`${apiBase}/verify_session.php`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Session verification failed:', error);
    return false;
  }
};

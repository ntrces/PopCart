// Logout utility with back button prevention
export const handleLogout = (navigate) => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.clear();
  
  // Clear session storage if used
  sessionStorage.clear();
  
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
const preventBackNavigation = (event) => {
  const user = localStorage.getItem('user');
  if (!user) {
    window.history.pushState(null, '', window.location.href);
    window.history.forward();
  }
};

// Initialize back button prevention on auth pages
export const initializeAuthProtection = () => {
  // Push initial state
  window.history.pushState(null, '', window.location.href);
  
  // Listen for back button
  const handlePopState = (event) => {
    const user = localStorage.getItem('user');
    if (user) {
      // User is logged in, allow navigation
      return;
    } else {
      // User is logged out, prevent back navigation
      window.history.pushState(null, '', window.location.href);
      window.history.forward();
    }
  };
  
  window.addEventListener('popstate', handlePopState);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
};

// Verify session is still valid (optional - requires session endpoint)
export const verifySession = async () => {
  try {
    const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/verify_session.php', {
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

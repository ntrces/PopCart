import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom hook to prevent back navigation after logout
export const usePreventBackAfterLogout = () => {
  useEffect(() => {
    // Disable browser caching for this page
    window.history.pushState(null, null, window.location.href);
    
    const handlePopState = () => {
      const user = localStorage.getItem('user');
      
      if (!user) {
        // User is not logged in, prevent going back
        window.history.pushState(null, null, window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};

// Custom hook to protect routes that require authentication
export const useAuthProtection = (requiredRoles = []) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      // Not logged in, redirect to signin
      navigate('/signin', { replace: true });
      return;
    }
    
    if (requiredRoles.length > 0) {
      try {
        const userData = JSON.parse(user);
        if (!requiredRoles.includes(userData.usertype)) {
          // User doesn't have required role
          navigate('/signin', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/signin', { replace: true });
      }
    }
    
    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    
    const handleBackButton = (event) => {
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        window.history.pushState(null, null, window.location.href);
      }
    };
    
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, requiredRoles]);
};

// Custom hook for signin/landing pages - prevent access if already logged in
export const useRedirectIfAuthenticated = (redirectTo = '/buyer') => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Redirect based on usertype
        if (userData.usertype === 'buyer') {
          navigate('/buyer', { replace: true });
        } else if (userData.usertype === 'employee') {
          navigate('/employee', { replace: true });
        } else if (userData.usertype === 'admin' || userData.usertype === 'SuperAdmin') {
          navigate('/admin', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate, redirectTo]);
};

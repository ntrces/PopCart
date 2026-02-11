import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

// Custom hook to prevent back navigation after logout
export const usePreventBackAfterLogout = () => {
  useEffect(() => {
    // Disable browser caching for this page
    window.history.pushState(null, null, window.location.href);
    
    const handlePopState = () => {
      // Note: ProtectedRoute will handle session verification
      // Just prevent back navigation for UX
      window.history.pushState(null, null, window.location.href);
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
  const { user: authUser } = useAuth();
  
  useEffect(() => {
    if (!authUser?.user_id) {
      // Not logged in, redirect to signin
      navigate('/signin', { replace: true });
      return;
    }
    
    if (requiredRoles.length > 0) {
      if (!requiredRoles.includes(authUser.usertype)) {
        // User doesn't have required role
        navigate('/signin', { replace: true });
      }
    }
    
    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    
    const handleBackButton = () => {
      // Note: Let ProtectedRoute handle session verification
      // Just prevent actual back navigation for UX
      window.history.pushState(null, null, window.location.href);
    };
    
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, requiredRoles, authUser]);
};

// Custom hook for signin/landing pages - prevent access if already logged in
export const useRedirectIfAuthenticated = (redirectTo = '/buyer') => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  
  useEffect(() => {
    if (authUser?.user_id) {
      // Redirect based on usertype from verified session
      if (authUser.usertype === 'buyer') {
        navigate('/buyer', { replace: true });
      } else if (authUser.usertype === 'employee') {
        navigate('/employee', { replace: true });
      } else if (authUser.usertype === 'admin' || authUser.usertype === 'SuperAdmin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [navigate, authUser]);
};

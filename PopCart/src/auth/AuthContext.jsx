import React, { useState, useEffect } from "react";
import { apiUrl } from "../utils/api.js";
import AuthContext from "./context.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true); // Track if we're verifying session
  
  const login = (role, extras = {}) => setUser({ role, ...extras });
  
  // Verify session validity on app load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(apiUrl("verify_session.php"), {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        
        const data = await response.json();
        
        if (data.success && data.user) {
          // Session is valid, restore user
          setUser({ role: data.user.usertype, ...data.user });
        } else {
          // Session is invalid, ensure localStorage is cleared
          localStorage.removeItem("user");
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);
        }
      } catch (error) {
        console.error("Session verification error:", error);
        // On error, clear user to be safe
        setUser(null);
      } finally {
        setIsChecking(false);
      }
    };
    
    verifySession();
  }, []);
  
  const logout = async () => {
    try {
      // Get user data before clearing localStorage
      const storedUser = localStorage.getItem('user');
      const userData = storedUser ? JSON.parse(storedUser) : null;
      
      console.log('Logout: User data from localStorage:', userData);
      
      // Prepare user_id, ensuring it's a valid number
      const userId = userData?.user_id ? parseInt(userData.user_id, 10) : null;
      const userType = userData?.usertype || null;
      
      console.log('Logout: Prepared userId:', userId, 'userType:', userType);
      
      // Only send if we have valid user_id
      if (userId && !isNaN(userId)) {
        const response = await fetch(apiUrl("logout.php"), {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          keepalive: true, // CRITICAL: Ensures request completes even if page navigates away
          body: JSON.stringify({
            user_id: userId,
            usertype: userType
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Logout response:', data);
        } else {
          console.error('Logout failed with status:', response.status);
        }
        
        // Small delay to ensure the server processes the request
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.log('Logout: No valid userId found');
      }
    } catch (error) {
      // Log error but don't block logout flow
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  // Handle automatic logout when browser closes or tab closes
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;
        
        if (userData && userData.user_id) {
          const userId = parseInt(userData.user_id, 10);
          const userType = userData.usertype || null;
          
          // Send logout request with keepalive to ensure it completes even during unload
          fetch(apiUrl("logout.php"), {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            keepalive: true, // CRITICAL: Ensures request completes even if page unloads
            body: JSON.stringify({
              user_id: userId,
              usertype: userType
            })
          }).catch(() => {
            // Silently fail during unload as the page is closing anyway
          });
        }
      } catch (error) {
        // Silently handle errors during browser close
      }
    };

    // Listen for browser/tab close and page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup the event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isChecking }}>
      {children}
    </AuthContext.Provider>
  );
}

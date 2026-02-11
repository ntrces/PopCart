import React, { useState, useEffect } from "react";
import { apiUrl } from "../utils/api.js";
import AuthContext from "./context.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true); // Track if we're verifying session
  
  const login = (role, extras = {}) => setUser({ role, ...extras });
  
  // Function to verify session with server
  const verifySessionWithServer = async () => {
    try {
      const response = await fetch(apiUrl("verify_session.php"), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.user) {
        // Session is valid, restore user
        setUser({ role: data.user.usertype, ...data.user });
        // Keep user data in localStorage in sync
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        // Session is invalid on server
        // Clear all client-side authentication data
        localStorage.removeItem("user");
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Session verification error:", error);
      // On error, assume user is not authenticated to be safe
      localStorage.removeItem("user");
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      return false;
    }
  };
  
  // Verify session validity on app load
  useEffect(() => {
    verifySessionWithServer().finally(() => {
      setIsChecking(false);
    });
  }, []);
  
  // Listen for logout messages from other tabs via storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      // When another tab logs out, it sets logout_event to "true"
      if (e.key === "logout_event" && e.newValue === "true") {
        console.log("Logout detected from another tab, clearing current session");
        setUser(null);
        localStorage.removeItem("user");
        localStorage.clear();
        sessionStorage.clear();
        localStorage.removeItem("logout_event");
      }
      // If another tab clears user data, clear it in this tab too
      else if (e.key === "user" && e.newValue === null) {
        console.log("User data cleared from another tab");
        setUser(null);
        sessionStorage.clear();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
      // Always clear client state regardless of server response
      setUser(null);
      localStorage.removeItem("user");
      localStorage.clear();
      sessionStorage.clear();
      
      // Notify other tabs about logout via storage event
      localStorage.setItem("logout_event", "true");
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
          
          console.log('Browser closing - attempting logout for user:', userId);
          
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
          
          // Notify other tabs about logout via storage event
          try {
            localStorage.setItem("logout_event", "true");
          } catch (e) {
            // Silently handle storage errors during unload
          }
        }
      } catch (error) {
        // Silently handle errors during browser close
      }
    };

    // Listen for multiple unload events for better cross-browser support
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      // Cleanup the event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isChecking, verifySessionWithServer }}>
      {children}
    </AuthContext.Provider>
  );
}

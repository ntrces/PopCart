import React, { useState } from "react";
import AuthContext from "./context.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (role, extras = {}) => setUser({ role, ...extras });
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
        const response = await fetch("http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/logout.php", {
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

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

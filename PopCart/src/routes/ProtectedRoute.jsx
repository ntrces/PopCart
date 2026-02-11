import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.jsx";
import { apiUrl } from "../utils/api.js";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isChecking } = useAuth();
  const [sessionValid, setSessionValid] = useState(null);
  const [verifiedUser, setVerifiedUser] = useState(null);

  // Verify session with server every time this route is accessed
  useEffect(() => {
    const verifySessionWithServer = async () => {
      try {
        const response = await fetch(apiUrl("verify_session.php"), {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok && data.success && data.user) {
          // Session is valid on server
          setVerifiedUser(data.user);
          setSessionValid(true);
        } else {
          // Session is invalid on server
          setVerifiedUser(null);
          setSessionValid(false);
        }
      } catch (error) {
        console.error("Session verification error:", error);
        setVerifiedUser(null);
        setSessionValid(false);
      }
    };

    // Always verify session with server once we're done checking initial auth state
    // The server is the source of truth - it doesn't matter if user state is empty in AuthContext
    if (!isChecking) {
      verifySessionWithServer();  // Calls verify_session.php
    }
  }, [isChecking]);

  // Show nothing while checking initial authentication
  if (isChecking) {
    return <div></div>;
  }

  // Show nothing while verifying session with server
  if (sessionValid === null) {
    return <div></div>;
  }

  // Session is not valid, redirect to signin
  if (!sessionValid || !verifiedUser) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role - if not, redirect to signin (not authorized for this route)
  if (allowedRoles.length && !allowedRoles.includes(verifiedUser.usertype)) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

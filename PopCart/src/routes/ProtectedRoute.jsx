import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.jsx";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isChecking } = useAuth();

  // Show nothing while verifying session (to avoid flash of redirect)
  if (isChecking) {
    return <div></div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}




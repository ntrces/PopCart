import React, { useState } from "react";
import AuthContext from "./context.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (role, extras = {}) => setUser({ role, ...extras });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
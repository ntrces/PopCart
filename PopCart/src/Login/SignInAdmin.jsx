import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api.js";
import "./SignInAdmin.css";

export default function SignInAdmin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(apiUrl("signin_admin.php"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));

          // Allow both 'admin' and 'SuperAdmin' user types to access admin module
          if (data.usertype === "admin" || data.usertype === "SuperAdmin") {
            navigate("/admin");
          } else {
            setErrors({ ...errors, password: "Only admin and SuperAdmin users can access this page." });
          }
        } else {
          setErrors({ ...errors, password: data.message });
        }
      } catch (err) {
        console.error("Error:", err);
        setErrors({ ...errors, password: "Server error. Please try again." });
      }
    }
  };

  return (
    <div className="sign-in">
      <div className="sign-in-card">
        <h1 className="title">🎵 Pop Cart Admin</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength="25"
              className={errors.password ? "input-error" : ""}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁" : "👁"}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
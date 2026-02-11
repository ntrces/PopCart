import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api.js";
import "./SignIn.css";

export default function SignIn() {
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
        const response = await fetch(apiUrl("signin.php"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));

          // Navigate based on usertype
          if (data.usertype === "buyer") {
            navigate("/buyer");
          } else if (data.usertype === "employee") {
            navigate("/employee");
          } else {
            // not registered or invalid usertype
            setErrors({ ...errors, password: "User not registered." });
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
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        <div className="tabs">
          <button className="tab active">Sign In</button>
          <button className="tab" onClick={() => navigate("/signup-buyer")}>
            Sign Up
          </button>
        </div>

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


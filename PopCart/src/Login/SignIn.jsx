import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

// IMPORTANT: Define the API endpoint URL
const API_URL = "http://localhost/popcart_api/signin.php";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  // ------------------------------------------------------------------
  // REVISED SUBMIT HANDLER WITH API CALL AND USERTYPE ROUTING
  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if form validation fails
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Welcome, ${result.user.firstname}!`);

        localStorage.setItem("user", JSON.stringify(result.user));

        // Use the usertype from the server to determine the route
        switch (result.user.usertype) {
            case 'admin':
                navigate("/admin-dashboard");
                break;
            case 'employee':
                navigate("/employee-dashboard");
                break;
            case 'buyer':
            default:
                // Redirects to Home page (as per your original code, but now after authentication)
                navigate("/home"); 
                break;
        }

        // OPTIONAL: Store user data/token in local storage here
        // localStorage.setItem('user', JSON.stringify(result.user));

      } else {
        // Login failed (Invalid credentials, inactive account, etc.)
        alert(`Login Failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Authentication Error:", error);
      alert("A network error occurred. Please check your server connection.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  // ------------------------------------------------------------------

  return (
    <div className="sign-in">
      <div className="sign-in-card">
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        <div className="tabs">
          <button className="tab active" disabled={isLoading}>Sign In</button>
          <button className="tab" onClick={() => navigate("/signup-buyer")} disabled={isLoading}>
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
            disabled={isLoading}
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
              className={errors.password ? "input-error" : ""}
              disabled={isLoading}
            />

            {/* Note: Change the toggle-eye to show different icons (e.g., FontAwesome, or different emojis) */}
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
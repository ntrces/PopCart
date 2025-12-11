import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpBuyer.css";

// ------------------------------------------------------------------
// 1. Define the API endpoint URL (Adjust this if your path is different!)
// IMPORTANT: This path assumes your PHP file is located at C:\xampp\htdocs\popcart_api\signup_buyer.php
const API_URL = "http://localhost/popcart_api/signup_buyer.php"; 
// ------------------------------------------------------------------

export default function SignUpBuyer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // State for loading status

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Last name
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    // First name
    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    // Email
    if (!form.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    // Birthday
    if (!form.birthday) {
      newErrors.birthday = "Birthday is required.";
      valid = false;
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    // Confirm Password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  // ------------------------------------------------------------------
  // 2. Implementation of the API call to the PHP backend
  // ------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setIsLoading(true); // Start loading state

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the form data (excluding confirmPassword) as a JSON string
        body: JSON.stringify({
            lastName: form.lastName,
            firstName: form.firstName,
            email: form.email,
            birthday: form.birthday,
            password: form.password, // PHP will hash this before storing
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Successful registration
        alert(result.message);
        navigate("/"); // Redirect to the Sign In page
      } else {
        // Registration failed (e.g., email already exists, or other server error)
        alert(`Sign Up Failed: ${result.message}`);
      }
    } catch (error) {
      // Network failure (server unreachable)
      console.error("API Fetch Error:", error);
      alert("Could not connect to the server. Please check your XAMPP Apache and MySQL services.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  // ------------------------------------------------------------------


  return (
    <div className="sign-up-buyer">
      <div className="sign-up-card">
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        {/* Tabs */}
        <div className="tabs">
          <button onClick={() => navigate("/")} className="tab">
            Sign In
          </button>
          <button className="tab active">Sign Up</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>

          {/* Name Row */}
          <div className="name-row">
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                className={errors.lastName ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="error-text">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                className={errors.firstName ? "input-error" : ""}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="error-text">{errors.firstName}</p>
              )}
            </div>
          </div>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            disabled={isLoading}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            className={errors.birthday ? "input-error" : ""}
            disabled={isLoading}
          />
          {errors.birthday && <p className="error-text">{errors.birthday}</p>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            disabled={isLoading}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
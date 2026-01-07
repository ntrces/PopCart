import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpBuyer.css";

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }

    if (!form.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    if (!form.birthday) {
      newErrors.birthday = "Birthday is required.";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch(
        "http://localhost/popcart-api/signup_buyer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lastName: form.lastName,
            firstName: form.firstName,
            email: form.email,
            birthday: form.birthday,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Account created successfully!");
        navigate("/signin"); // Navigate to Sign In
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="sign-up-buyer">
      <div className="sign-up-card">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        <div className="tabs">
          <button onClick={() => navigate("/signin")} className="tab">
            Sign In
          </button>
          <button className="tab active">Sign Up</button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
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
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <label htmlFor="birthday">Birthday</label>
          <input
            id="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            className={errors.birthday ? "input-error" : ""}
          />
          {errors.birthday && (
            <p className="error-text">{errors.birthday}</p>
          )}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-text">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

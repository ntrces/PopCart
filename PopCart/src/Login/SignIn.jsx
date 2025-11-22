import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="sign-in">
      <div className="sign-in-card">
        {/* Header */}
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        {/* Tabs */}
        <div className="tabs">
          <button className="tab active">Sign In</button>
          <button className="tab" onClick={() => navigate("/signup-buyer")}>Sign Up</button>
        </div>

        {/* Form */}
        <form className="form">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />

          <button type="submit" className="submit-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
}

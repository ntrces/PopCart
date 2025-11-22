import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpBuyer.css";

export default function SignUpBuyer() {
  const navigate = useNavigate();

  return (
    <div className="sign-up-buyer">
      <div className="sign-up-card">
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        {/* Tabs */}
        <div className="tabs">
          <button onClick={() => navigate("/")} className="tab">Sign In</button>
          <button className="tab active">Sign Up</button>
        </div>

        <form className="form">

  {/* Name Row — Last & First */}
  <div className="name-row">
    <div>
      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" type="text" placeholder="Doe" />
    </div>

    <div>
      <label htmlFor="firstName">First Name</label>
      <input id="firstName" type="text" placeholder="John" />
    </div>
  </div>

  <label htmlFor="email">Email</label>
  <input id="email" type="email" placeholder="you@example.com" />

  <label htmlFor="birthday">Birthday</label>
  <input id="birthday" type="date" />

  <label htmlFor="password">Password</label>
  <input id="password" type="password" placeholder="••••••••" />

  <label htmlFor="confirmPassword">Confirm Password</label>
  <input id="confirmPassword" type="password" placeholder="••••••••" />

  <button type="submit" className="submit-btn">Sign Up</button>
</form>

      </div>
    </div>
  );
}

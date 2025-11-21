import React from "react";
import "./SignIn.css";

export const SignIn = () => {
  return (
    <div className="sign-in">
  <div className="sign-in-card">
    <h1>🎵 Pop Cart</h1>
    <p>Your marketplace for authentic albums</p>

    <div className="sign-in-tabs">
      <button className="active">Sign In</button>
      <button>Sign Up</button>
    </div>

    <form className="sign-in-form">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" placeholder="you@example.com" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" placeholder="••••••••" />

      <button type="button" className="forgot-password">Forgot password?</button>
      <button type="submit" className="submit-btn">Sign In</button>
    </form>
  </div>
</div>

  );
};

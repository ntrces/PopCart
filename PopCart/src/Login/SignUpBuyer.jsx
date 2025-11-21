import React from "react";
import "./SignUpBuyer.css";

export const SignUpBuyer = () => {
  return (
    <div className="sign-up-buyer">
      <div className="sign-up-card">
        <h1 className="title">🎵 Pop Cart</h1>
        <p className="subtitle">Your marketplace for authentic albums</p>

        <div className="tabs">
          <button className="tab">Sign In</button>
          <button className="tab active">Sign Up</button>
        </div>

        <form className="form">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Your name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />

          <label>I want to...</label>
          <div className="option-select">
            <span>Buy albums</span>
          </div>

          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

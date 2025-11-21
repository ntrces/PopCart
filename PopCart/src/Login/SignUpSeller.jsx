import React, { useState } from "react";
import "./SignUpSeller.css";

export default function SignUpSeller() {
  const [role, setRole] = useState("Sell albums");

  return (
    <div className="pc-container">
      <div className="pc-card">
        <h2 className="pc-title">🎵 Pop Cart</h2>
        <p className="pc-subtitle">Your marketplace for authentic albums</p>

        <div className="pc-switch">
          <button className="pc-switch-btn active">Sign In</button>
          <button className="pc-switch-btn">Sign Up</button>
        </div>

        <form className="pc-form">
          <label>Name</label>
          <input type="text" placeholder="Your name" />

          <label>Email</label>
          <input type="email" placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" />

          <label>I want to…</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Sell albums</option>
            <option>Buy albums</option>
          </select>

          {role === "Sell albums" && (
            <div className="pc-box">
              <h3>Seller Verification Information</h3>
              <p className="pc-info-text">
                Please provide the following information to verify your authenticity as a seller.
              </p>

              <label>Business/Store Name *</label>
              <input type="text" placeholder="e.g., Vintage Vinyl Shop" />

              <label>Business Type *</label>
              <select>
                <option>Select type</option>
                <option>Physical Store</option>
                <option>Online Shop</option>
                <option>Independent Seller</option>
              </select>

              <label>Years in Business *</label>
              <input type="number" placeholder="e.g., 5" />

              <label>Phone Number *</label>
              <input type="text" placeholder="e.g., +1 234 567 8900" />

              <label>Website/Social Media</label>
              <input type="text" placeholder="https://your-store.com or social media link" />

              <label>Business Address *</label>
              <textarea placeholder="Full business address" />

              <label>About Your Business *</label>
              <textarea placeholder="Tell us about your business, what types of albums you sell, and why you're passionate about it" />

              <label>References (Optional)</label>
              <input type="text" placeholder="Any references, certifications, or links to reviews from other platforms..." />
            </div>
          )}

          <button type="submit" className="pc-submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./HeaderA.css";

export default function HeaderA() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
  }, []);

  return (
    <div className="header-wrapper" role="banner">
      <header className="header-container">
        <div className="header-left">

          <div className="header-logo-section">
            <div className="header-logo-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15V4.16667L17.5 2.5V13.3333" stroke="#8B5CF6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 17.5C6.38071 17.5 7.5 16.3807 7.5 15C7.5 13.6193 6.38071 12.5 5 12.5C3.61929 12.5 2.5 13.6193 2.5 15C2.5 16.3807 3.61929 17.5 5 17.5Z" stroke="#8B5CF6" strokeWidth="1.66667"/>
                <path d="M15 15.8333C16.3807 15.8333 17.5 14.714 17.5 13.3333C17.5 11.9526 16.3807 10.8333 15 10.8333C13.6193 10.8333 12.5 11.9526 12.5 13.3333C12.5 14.714 13.6193 15.8333 15 15.8333Z" stroke="#8B5CF6" strokeWidth="1.66667"/>
              </svg>
            </div>

            <h1 className="header-title">Pop Cart</h1>
          </div>
        </div>

        <div className="header-right">
          <button
            className="header-notification-btn"
            aria-label="Notifications"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path d="M4 5.33334C4 4.27247 4.42143 3.25505 5.17157 2.50491C5.92172 1.75476 6.93913 1.33334 8 1.33334C9.06087 1.33334 10.0783 1.75476 10.8284 2.50491C11.5786 3.25505 12 4.27247 12 5.33334C12 10 14 11.3333 14 11.3333H2C2 11.3333 4 10 4 5.33334Z" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.15339 14C9.15339 14.3943 8.99676 14.7724 8.71795 15.0512C8.43915 15.33 8.06101 15.4867 7.66672 15.4867C7.27243 15.4867 6.89429 15.33 6.61549 15.0512C6.33668 14.7724 6.18005 14.3943 6.18005 14" stroke="black" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>

          <div className="header-profile-avatar" title={user?.firstname || "Admin"}>{user?.firstname?.charAt(0) || "A"}</div>
          <div className="header-profile-name">{user?.firstname || "Admin"}</div>
        </div>
      </header>
    </div>
  );
}
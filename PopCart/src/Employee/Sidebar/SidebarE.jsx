// ...existing code...
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import "./SidebarE.css";

export default function SidebarE({ onSignOutClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { id: "products", label: "Product Management", path: "/employee/products", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V6C15.7497 5.73695 15.6803 5.4786 15.5487 5.25087C15.417 5.02313 15.2278 4.83402 15 4.7025L9.75 1.7025C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.7025L3 4.7025C2.7722 4.83402 2.58299 5.02313 2.45135 5.25087C2.31971 5.4786 2.25027 5.73695 2.25 6V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 16.5V9" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.4675 5.25L9 9L15.5325 5.25" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.625 3.2025L12.375 7.065" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { id: "orders", label: "Order Management", path: "/employee/orders", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.5C12 8.29565 11.6839 9.05871 11.1213 9.62132C10.5587 10.1839 9.79565 10.5 9 10.5C8.20435 10.5 7.44129 10.1839 6.87868 9.62132C6.31607 9.05871 6 8.29565 6 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.32724 4.5255H15.6727" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.55 4.10025C2.35527 4.35989 2.25 4.67569 2.25 5.00025V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H14.25C14.6478 16.5 15.0294 16.342 15.3107 16.0607C15.592 15.7794 15.75 15.3978 15.75 15V5.00025C15.75 4.67569 15.6447 4.35989 15.45 4.10025L13.95 2.1C13.8103 1.91371 13.6291 1.7625 13.4208 1.65836C13.2125 1.55422 12.9829 1.5 12.75 1.5H5.25C5.01713 1.5 4.78746 1.55422 4.57918 1.65836C4.3709 1.7625 4.18972 1.91371 4.05 2.1L2.55 4.10025Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <aside className="sidebar-container sidebar-open" aria-label="Admin navigation">
      <div className="sidebar-header">
        <span className="sidebar-title">Employee Panel</span>
      </div>

      <div className="sidebar-nav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? "sidebar-nav-item-active" : ""}`}
          >
            <div className={`sidebar-nav-icon ${isActive(item.path) ? "sidebar-nav-icon-active" : ""}`}>
              {React.isValidElement(item.icon)
                ? React.cloneElement(item.icon, {
                    stroke: isActive(item.path) ? "white" : "currentColor",
                  })
                : item.icon}
            </div>
            <span className="sidebar-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button
          onClick={onSignOutClick}
          className="sidebar-signout-btn"
          aria-label="Sign out"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 15.75H3.75C3.33579 15.75 3 15.4142 3 15V3C3 2.58579 3.33579 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}

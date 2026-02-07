// ...existing code...
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import "./SidebarA.css";

export default function SidebarA({ onSignOutClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.25 2.25V14.25C2.25 14.6478 2.40804 15.0294 2.68934 15.3107C2.97064 15.592 3.35218 15.75 3.75 15.75H15.75" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 12.75V6.75" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.75 12.75V3.75" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12.75V10.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { id: "users", label: "Users", path: "/admin/users", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2.346C12.6433 2.51278 13.213 2.88845 13.6198 3.41405C14.0265 3.93965 14.2471 4.58542 14.2471 5.25C14.2471 5.91459 14.0265 6.56036 13.6198 7.08596C13.213 7.61156 12.6433 7.98723 12 8.154" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.5 15.75V14.25C16.4995 13.5853 16.2783 12.9396 15.871 12.4142C15.4638 11.8889 14.8936 11.5137 14.25 11.3475" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.75 8.25C8.40685 8.25 9.75 6.90685 9.75 5.25C9.75 3.59315 8.40685 2.25 6.75 2.25C5.09315 2.25 3.75 3.59315 3.75 5.25C3.75 6.90685 5.09315 8.25 6.75 8.25Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { id: "products", label: "Products", path: "/admin/products", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V6C15.7497 5.73695 15.6803 5.4786 15.5487 5.25087C15.417 5.02313 15.2278 4.83402 15 4.7025L9.75 1.7025C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.7025L3 4.7025C2.7722 4.83402 2.58299 5.02313 2.45135 5.25087C2.31971 5.4786 2.25027 5.73695 2.25 6V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 16.5V9" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.4675 5.25L9 9L15.5325 5.25" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.625 3.2025L12.375 7.065" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.5C12 8.29565 11.6839 9.05871 11.1213 9.62132C10.5587 10.1839 9.79565 10.5 9 10.5C8.20435 10.5 7.44129 10.1839 6.87868 9.62132C6.31607 9.05871 6 8.29565 6 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.32724 4.5255H15.6727" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.55 4.10025C2.35527 4.35989 2.25 4.67569 2.25 5.00025V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H14.25C14.6478 16.5 15.0294 16.342 15.3107 16.0607C15.592 15.7794 15.75 15.3978 15.75 15V5.00025C15.75 4.67569 15.6447 4.35989 15.45 4.10025L13.95 2.1C13.8103 1.91371 13.6291 1.7625 13.4208 1.65836C13.2125 1.55422 12.9829 1.5 12.75 1.5H5.25C5.01713 1.5 4.78746 1.55422 4.57918 1.65836C4.3709 1.7625 4.18972 1.91371 4.05 2.1L2.55 4.10025Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { id: "audit", label: "Audit Logs", path: "/admin/audit", icon: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.99996 14.6663C3.64634 14.6663 3.3072 14.5259 3.05715 14.2758C2.8071 14.0258 2.66663 13.6866 2.66663 13.333V2.66634C2.66663 2.31272 2.8071 1.97358 3.05715 1.72353C3.3072 1.47349 3.64634 1.33301 3.99996 1.33301H9.33329C9.54433 1.33267 9.75335 1.37408 9.94831 1.45486C10.1433 1.53563 10.3203 1.65418 10.4693 1.80368L12.8613 4.19568C13.0112 4.34468 13.1301 4.52191 13.2111 4.71712C13.2921 4.91233 13.3336 5.12166 13.3333 5.33301V13.333C13.3333 13.6866 13.1928 14.0258 12.9428 14.2758C12.6927 14.5259 12.3536 14.6663 12 14.6663H3.99996Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.33337 1.33301V4.66634C9.33337 4.84315 9.40361 5.01272 9.52864 5.13775C9.65366 5.26277 9.82323 5.33301 10 5.33301H13.3334" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.66671 6H5.33337" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6667 8.66699H5.33337" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6667 11.333H5.33337" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/></svg>) },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-container sidebar-open" aria-label="Admin navigation">
      <div className="sidebar-header">
        <span className="sidebar-title">Admin Panel</span>
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

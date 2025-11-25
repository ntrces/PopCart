import React, { useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";


export default function Buyernotif() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [showSignOutModal, setShowSignOutModal] = useState(false);


  return (
    <div className="Buyernotif-wrapper">

      {/* TOP BAR */}
      <div className="top-bar">
  <div className="left-group">
<button className="toggle-btn" onClick={toggleSidebar}>☰</button>
    <div className="logo"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 15V4.16667L17.5 2.5V13.3333" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 17.5C6.38071 17.5 7.5 16.3807 7.5 15C7.5 13.6193 6.38071 12.5 5 12.5C3.61929 12.5 2.5 13.6193 2.5 15C2.5 16.3807 3.61929 17.5 5 17.5Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 15.8333C16.3807 15.8333 17.5 14.7141 17.5 13.3333C17.5 11.9526 16.3807 10.8333 15 10.8333C13.6193 10.8333 12.5 11.9526 12.5 13.3333C12.5 14.7141 13.6193 15.8333 15 15.8333Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 Pop Cart</div>
  </div>

        <div className="right-controls">
          <Link to="/cart" className="icon-btn">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_42_608)">
                    <path d="M6 16.5C6.41421 16.5 6.75 16.1642 6.75 15.75C6.75 15.3358 6.41421 15 6 15C5.58579 15 5.25 15.3358 5.25 15.75C5.25 16.1642 5.58579 16.5 6 16.5Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.25 16.5C14.6642 16.5 15 16.1642 15 15.75C15 15.3358 14.6642 15 14.25 15C13.8358 15 13.5 15.3358 13.5 15.75C13.5 16.1642 13.8358 16.5 14.25 16.5Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.53748 1.53751H3.03748L5.03248 10.8525C5.10566 11.1937 5.29548 11.4986 5.56926 11.7149C5.84304 11.9312 6.18366 12.0453 6.53248 12.0375H13.8675C14.2089 12.037 14.5398 11.92 14.8057 11.7059C15.0717 11.4918 15.2566 11.1934 15.33 10.86L16.5675 5.28751H3.83998" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_42_608">
                    <rect width="18" height="18" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                    
                             </Link>

          <Link to="/Buyernotif" className="icon-btn">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.84534 14C6.96237 14.2027 7.13068 14.371 7.33337 14.488C7.53605 14.605 7.76597 14.6666 8 14.6666C8.23404 14.6666 8.46396 14.605 8.66664 14.488C8.86933 14.371 9.03764 14.2027 9.15467 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.17467 10.2173C2.08758 10.3128 2.0301 10.4315 2.00924 10.559C1.98837 10.6865 2.00501 10.8174 2.05714 10.9356C2.10926 11.0538 2.19462 11.1544 2.30284 11.225C2.41105 11.2956 2.53745 11.3332 2.66667 11.3333H13.3333C13.4625 11.3334 13.589 11.2959 13.6972 11.2254C13.8055 11.1549 13.891 11.0545 13.9433 10.9364C13.9955 10.8182 14.0123 10.6874 13.9916 10.5599C13.9709 10.4323 13.9136 10.3136 13.8267 10.218C12.94 9.30401 12 8.33268 12 5.33334C12 4.27248 11.5786 3.25506 10.8284 2.50492C10.0783 1.75477 9.06087 1.33334 8 1.33334C6.93914 1.33334 5.92172 1.75477 5.17157 2.50492C4.42143 3.25506 4 4.27248 4 5.33334C4 8.33268 3.05933 9.30401 2.17467 10.2173Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
                     </Link>
                     
          <Link to="/myprofile" className="profile">
                      <div className="avatar">A</div>
                      <p>Althea</p>
                    </Link>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="home-container">

        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="sidebar">

   <nav className="nav-menu">
    
<Link to="/Home">
 <button className="nav-item "> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 15.75V9.75C11.25 9.55109 11.171 9.36032 11.0303 9.21967C10.8897 9.07902 10.6989 9 10.5 9H7.5C7.30109 9 7.11032 9.07902 6.96967 9.21967C6.82902 9.36032 6.75 9.55109 6.75 9.75V15.75" stroke="black" stroke-width="1.5"/>
<path d="M2.25 7.49999C2.24995 7.28179 2.2975 7.06621 2.38934 6.86828C2.48118 6.67035 2.6151 6.49484 2.78175 6.35399L8.03175 1.85399C8.30249 1.62517 8.64552 1.49963 9 1.49963C9.35448 1.49963 9.69751 1.62517 9.96825 1.85399L15.2183 6.35399C15.3849 6.49484 15.5188 6.67035 15.6107 6.86828C15.7025 7.06621 15.7501 7.28179 15.75 7.49999V14.25C15.75 14.6478 15.592 15.0293 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0293 2.25 14.6478 2.25 14.25V7.49999Z" stroke="black" stroke-width="1.5"/>
</svg>
Home</button> </Link>

 <Link to="/marketplace">
<button className="nav-item"> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_41_320)">
<path d="M1.5 5.25L4.8075 1.9425C4.94704 1.80212 5.11299 1.69075 5.29577 1.61481C5.47856 1.53886 5.67457 1.49984 5.8725 1.5H12.1275C12.3254 1.49984 12.5214 1.53886 12.7042 1.61481C12.887 1.69075 13.053 1.80212 13.1925 1.9425L16.5 5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 9V15C3 15.3978 3.15804 15.7794 3.43934 16.0607C3.72064 16.342 4.10218 16.5 4.5 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 16.5V13.5C11.25 13.1022 11.092 12.7206 10.8107 12.4393C10.5294 12.158 10.1478 12 9.75 12H8.25C7.85218 12 7.47064 12.158 7.18934 12.4393C6.90804 12.7206 6.75 13.1022 6.75 13.5V16.5" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.5 5.25H16.5" stroke="#0A0A0A" stroke-width="1.5" strokelinecap="round" strokelinejoin="round"/>
<path d="M16.5 5.25V7.5C16.5 7.89782 16.342 8.27936 16.0607 8.56066C15.7794 8.84196 15.3978 9 15 9C14.5618 8.97588 14.1433 8.81006 13.8075 8.5275C13.718 8.46283 13.6104 8.42802 13.5 8.42802C13.3896 8.42802 13.282 8.46283 13.1925 8.5275C12.8567 8.81006 12.4382 8.97588 12 9C11.5618 8.97588 11.1433 8.81006 10.8075 8.5275C10.718 8.46283 10.6104 8.42802 10.5 8.42802C10.3896 8.42802 10.282 8.46283 10.1925 8.5275C9.8567 8.81006 9.4382 8.97588 9 9C8.5618 8.97588 8.1433 8.81006 7.8075 8.5275C7.71801 8.46283 7.61041 8.42802 7.5 8.42802C7.38959 8.42802 7.28199 8.46283 7.1925 8.5275C6.8567 8.81006 6.4382 8.97588 6 9C5.5618 8.97588 5.1433 8.81006 4.8075 8.5275C4.71801 8.46283 4.61041 8.42802 4.5 8.42802C4.38959 8.42802 4.28199 8.46283 4.1925 8.5275C3.8567 8.81006 3.4382 8.97588 3 9C2.60218 9 2.22064 8.84196 1.93934 8.56066C1.65804 8.27936 1.5 7.89782 1.5 7.5V5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_41_320">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
 Marketplace</button> </Link>

              <Link to="/MyOrder">
               <button className="nav-item active"> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V5.99999C15.7497 5.73694 15.6803 5.4786 15.5487 5.25086C15.417 5.02312 15.2278 4.83401 15 4.70249L9.75 1.70249C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.70249L3 4.70249C2.7722 4.83401 2.58299 5.02312 2.45135 5.25086C2.31971 5.4786 2.25027 5.73694 2.25 5.99999V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 16.5V9" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.46753 5.25L9.00003 9L15.5325 5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.625 3.20251L12.375 7.06501" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
               My Orders</button> </Link>

<button className="sign-out" onClick={() => setShowSignOutModal(true)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12.75L15.75 9L12 5.25" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.75 9H6.75" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75"
                    stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            </nav>
          </aside>
        )}

        {showSignOutModal && (
  <div className="modal-overlay">
    <div className="signout-modal">
      <h3>Sign Out</h3>
      <p>Are you sure you want to sign out?</p>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={() => setShowSignOutModal(false)}>
          Cancel
        </button>

        <button className="confirm-btn">
          Sign Out
        </button>
      </div>
    </div>
  </div>
)}

        {/* MAIN CONTENT */}
        <main className="main-content">
          
        </main>
      </div>
    </div>
  );
}

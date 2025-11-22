import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="music-icon">🎵</span> Pop Cart
        </div>

        <nav className="nav-menu">
          <button className="nav-item active">Home</button>
          <button className="nav-item">Marketplace</button>
          <button className="nav-item">My Orders</button>
          <button className="sign-out">Sign Out</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div>
            <h2>Welcome back, Althea! 🎵</h2>
            <p className="subtext">Discover authentic albums and expand your collection</p>
          </div>
          <div className="header-right">
            <button className="icon-btn"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
</button>
            <button className="icon-btn"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.84534 14C6.96237 14.2027 7.13068 14.371 7.33337 14.488C7.53605 14.605 7.76597 14.6666 8 14.6666C8.23404 14.6666 8.46396 14.605 8.66664 14.488C8.86933 14.371 9.03764 14.2027 9.15467 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.17467 10.2173C2.08758 10.3128 2.0301 10.4315 2.00924 10.559C1.98837 10.6865 2.00501 10.8174 2.05714 10.9356C2.10926 11.0538 2.19462 11.1544 2.30284 11.225C2.41105 11.2956 2.53745 11.3332 2.66667 11.3333H13.3333C13.4625 11.3334 13.589 11.2959 13.6972 11.2254C13.8055 11.1549 13.891 11.0545 13.9433 10.9364C13.9955 10.8182 14.0123 10.6874 13.9916 10.5599C13.9709 10.4323 13.9136 10.3136 13.8267 10.218C12.94 9.30401 12 8.33268 12 5.33334C12 4.27248 11.5786 3.25506 10.8284 2.50492C10.0783 1.75477 9.06087 1.33334 8 1.33334C6.93914 1.33334 5.92172 1.75477 5.17157 2.50492C4.42143 3.25506 4 4.27248 4 5.33334C4 8.33268 3.05933 9.30401 2.17467 10.2173Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
            <div className="profile">
              <div className="avatar">A</div>
              <div className="user-info">
                <p>Althea</p>
                <span>buyer</span>
              </div>
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Orders</p>
            <h3 className="number">0</h3>
            <span className="stat-desc">All time purchases</span>
          </div>

          <div className="stat-card">
            <p className="stat-label">Pending Orders</p>
            <h3 className="number">0</h3>
            <span className="stat-desc">In progress</span>
          </div>

          <div className="stat-card">
            <p className="stat-label">Completed</p>
            <h3 className="number">0</h3>
            <span className="stat-desc">Successfully delivered</span>
          </div>
        </div>

        {/* ALBUMS */}
        <div className="albums-section">
          <div className="albums-header">
            <h3>Albums</h3>
            <button className="view-all">View All ➜</button>
          </div>

          <div className="album-list">
            {[1, 2, 3].map((item) => (
              <div className="album-card" key={item}>
                <div className="album-img"></div>
                <div className="album-info">
                  <h4>Album {item}</h4>
                  <p>Artist Name</p>
                  <p className="price">₱398.97</p>

                  <div className="album-actions">
                    <button className="details-btn">⭕ Details</button>
                    <button className="cart-btn">🛒 Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

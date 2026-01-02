import React, { useState, useEffect } from "react";
import "./Marketplace.css";
import { Link } from "react-router-dom";
import getImageUrl from "../../utils/getImageUrl";
import placeholder from "../../assets/image.png";


export default function Marketplace() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [user, setUser] = useState(null);

  const [showAddCartModal, setShowAddCartModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Use empty array initially, load from API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [genres, setGenres] = useState(["Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic", "Country", "R&B", "Reggae", "Blues"]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    // Load existing cart items from localStorage on component mount
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        setCartItems([]); // Reset if corrupted
      }
    }
    
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        try {
          const response = await fetch(`http://localhost/popcart-api/get_user.php?user_id=${userData.user_id}`);
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    fetchUser();
    
    // Fetch products from API and replace sample data
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost/popcart-api/get_products.php');
        const data = await res.json();
        if (data && data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          // If API returns unexpected structure, keep empty and log
          console.warn('get_products returned unexpected data', data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('This product is out of stock.');
      return;
    }
    // Check if the item already exists in the local state cart
    const existingItem = cartItems.find(item => item.product_id === product.product_id);
    
    let updatedCart;
    if (!existingItem) {
      // Add new item if it doesn't exist
      updatedCart = [...cartItems, { ...product, quantity: 1, lastModified: Date.now() }];
    } else {
      // If item exists, increase quantity
      if (existingItem.quantity >= product.stock) {
        alert('Maximum quantity reached based on available stock.');
        return;
      }
      updatedCart = cartItems.map(item => 
        item.product_id === product.product_id 
          ? { ...item, quantity: item.quantity + 1, lastModified: Date.now() } 
          : item
      );
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowAddCartModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.album_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.artist.toLowerCase().includes(searchQuery.toLowerCase());
    // Ensure case-insensitive genre matching
    const matchesGenre = selectedGenre === "All Genres" || product.genre?.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsDropdownOpen(false);
  };

  // Selected album image URL (safe to call even when selectedAlbum is null)
  const selectedImageUrl = getImageUrl(selectedAlbum?.album_cover_img);


  return (
    <div className="marketplace-wrapper">

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="left-group">
          <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15V4.16667L17.5 2.5V13.3333" stroke="#8B5CF6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 17.5C6.38071 17.5 7.5 16.3807 7.5 15C7.5 13.6193 6.38071 12.5 5 12.5C3.61929 12.5 2.5 13.6193 2.5 15C2.5 16.3807 3.61929 17.5 5 17.5Z" stroke="#8B5CF6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 15.8333C16.3807 15.8333 17.5 14.7141 17.5 13.3333C17.5 11.9526 16.3807 10.8333 15 10.8333C13.6193 10.8333 12.5 11.9526 12.5 13.3333C12.5 14.7141 13.6193 15.8333 15 15.8333Z" stroke="#8B5CF6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pop Cart
          </div>
        </div>

        <div className="right-controls">
          <Link to="/buyer/cart" className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_42_608)">
                <path d="M6 16.5C6.41421 16.5 6.75 16.1642 6.75 15.75C6.75 15.3358 6.41421 15 6 15C5.58579 15 5.25 15.3358 5.25 15.75C5.25 16.1642 5.58579 16.5 6 16.5Z" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.25 16.5C14.6642 16.5 15 16.1642 15 15.75C15 15.3358 14.6642 15 14.25 15C13.8358 15 13.5 15.3358 13.5 15.75C13.5 16.1642 13.8358 16.5 14.25 16.5Z" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.53748 1.53751H3.03748L5.03248 10.8525C5.10566 11.1937 5.29548 11.4986 5.56926 11.7149C5.84304 11.9312 6.18366 12.0453 6.53248 12.0375H13.8675C14.2089 12.037 14.5398 11.92 14.8057 11.7059C15.0717 11.4918 15.2566 11.1934 15.33 10.86L16.5675 5.28751H3.83998" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_42_608">
                  <rect width="18" height="18" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </Link>

          <Link to="/buyer/notifications" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.84534 14C6.96237 14.2027 7.13068 14.371 7.33337 14.488C7.53605 14.605 7.76597 14.6666 8 14.6666C8.23404 14.6666 8.46396 14.605 8.66664 14.488C8.86933 14.371 9.03764 14.2027 9.15467 14" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.17467 10.2173C2.08758 10.3128 2.0301 10.4315 2.00924 10.559C1.98837 10.6865 2.00501 10.8174 2.05714 10.9356C2.10926 11.0538 2.19462 11.1544 2.30284 11.225C2.41105 11.2956 2.53745 11.3332 2.66667 11.3333H13.3333C13.4625 11.3334 13.589 11.2959 13.6972 11.2254C13.8055 11.1549 13.891 11.0545 13.9433 10.9364C13.9955 10.8182 14.0123 10.6874 13.9916 10.5599C13.9709 10.4323 13.9136 10.3136 13.8267 10.218C12.94 9.30401 12 8.33268 12 5.33334C12 4.27248 11.5786 3.25506 10.8284 2.50492C10.0783 1.75477 9.06087 1.33334 8 1.33334C6.93914 1.33334 5.92172 1.75477 5.17157 2.50492C4.42143 3.25506 4 4.27248 4 5.33334C4 8.33268 3.05933 9.30401 2.17467 10.2173Z" stroke="#0A0A0A" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          
          <Link to="/buyer/profile" className="profile">
            <div className="avatar">{user?.firstname?.charAt(0).toUpperCase() || 'U'}</div>
            <p>{user?.firstname || 'User'}</p>
          </Link>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="home-container">

        {/* SIDEBAR */}
        {sidebarOpen && (

          <aside className="sidebar">

            <nav className="nav-menu">
              <Link to="/buyer">
                <button className="nav-item"> 
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.25 15.75V9.75C11.25 9.55109 11.171 9.36032 11.0303 9.21967C10.8897 9.07902 10.6989 9 10.5 9H7.5C7.30109 9 7.11032 9.07902 6.96967 9.21967C6.82902 9.36032 6.75 9.55109 6.75 9.75V15.75" stroke="black" strokeWidth="1.5"/>
                    <path d="M2.25 7.49999C2.24995 7.28179 2.2975 7.06621 2.38934 6.86828C2.48118 6.67035 2.6151 6.49484 2.78175 6.35399L8.03175 1.85399C8.30249 1.62517 8.64552 1.49963 9 1.49963C9.35448 1.49963 9.69751 1.62517 9.96825 1.85399L15.2183 6.35399C15.3849 6.49484 15.5188 6.67035 15.6107 6.86828C15.7025 7.06621 15.7501 7.28179 15.75 7.49999V14.25C15.75 14.6478 15.592 15.0293 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0293 2.25 14.6478 2.25 14.25V7.49999Z" stroke="black" strokeWidth="1.5"/>
                  </svg>
                  Home
                </button> 
              </Link>

              <Link to="/buyer/marketplace">
                <button className="nav-item active"> 
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_41_320)">
                      <path d="M1.5 5.25L4.8075 1.9425C4.94704 1.80212 5.11299 1.69075 5.29577 1.61481C5.47856 1.53886 5.67457 1.49984 5.8725 1.5H12.1275C12.3254 1.49984 12.5214 1.53886 12.7042 1.61481C12.887 1.69075 13.053 1.80212 13.1925 1.9425L16.5 5.25" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 9V15C3 15.3978 3.15804 15.7794 3.43934 16.0607C3.72064 16.342 4.10218 16.5 4.5 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.25 16.5V13.5C11.25 13.1022 11.092 12.7206 10.8107 12.4393C10.5294 12.158 10.1478 12 9.75 12H8.25C7.85218 12 7.47064 12.158 7.18934 12.4393C6.90804 12.7206 6.75 13.1022 6.75 13.5V16.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1.5 5.25H16.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 5.25V7.5C16.5 7.89782 16.342 8.27936 16.0607 8.56066C15.7794 8.84196 15.3978 9 15 9C14.5618 8.97588 14.1433 8.81006 13.8075 8.5275C13.718 8.46283 13.6104 8.42802 13.5 8.42802C13.3896 8.42802 13.282 8.46283 13.1925 8.5275C12.8567 8.81006 12.4382 8.97588 12 9C11.5618 8.97588 11.1433 8.81006 10.8075 8.5275C10.718 8.46283 10.6104 8.42802 10.5 8.42802C10.3896 8.42802 10.282 8.46283 10.1925 8.5275C9.8567 8.81006 9.4382 8.97588 9 9C8.5618 8.97588 8.1433 8.81006 7.8075 8.5275C7.71801 8.46283 7.61041 8.42802 7.5 8.42802C7.38959 8.42802 7.28199 8.46283 7.1925 8.5275C6.8567 8.81006 6.4382 8.97588 6 9C5.5618 8.97588 5.1433 8.81006 4.8075 8.5275C4.71801 8.46283 4.61041 8.42802 4.5 8.42802C4.38959 8.42802 4.28199 8.46283 4.1925 8.5275C3.8567 8.81006 3.4382 8.97588 3 9C2.60218 9 2.22064 8.84196 1.93934 8.56066C1.65804 8.27936 1.5 7.89782 1.5 7.5V5.25" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_41_320">
                        <rect width="18" height="18" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  Marketplace
                </button> 
              </Link>

              <Link to="/buyer/orders">
                <button className="nav-item"> 
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V5.99999C15.7497 5.73694 15.6803 5.4786 15.5487 5.25086C15.417 5.02312 15.2278 4.83401 15 4.70249L9.75 1.70249C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.70249L3 4.70249C2.7722 4.83401 2.58299 5.02312 2.45135 5.25086C2.31971 5.4786 2.25027 5.73694 2.25 5.99999V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 16.5V9" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.46753 5.25L9.00003 9L15.5325 5.25" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.625 3.20251L12.375 7.06501" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  My Orders
                </button> 
              </Link>

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

      
        <div className="marketplace-section">

          {/* TOP BAR / SEARCH / FILTERS */}
          <div className="pm-controls">
            <div className="pm-search">
              <label htmlFor="search-input" className="pm-search-label">
                <input
                  id="search-input"
                  className="pm-search-input"
                  placeholder="Search by title or artist..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search by title or artist"
                />
              </label>
            </div>

            <div className="pm-genre-dropdown">
              <button
                className="pm-dropdown-trigger"
                onClick={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Filter by genre"
              >
                <span className="pm-dropdown-label">{selectedGenre}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="pm-dropdown-menu" role="listbox" aria-label="Genre options">
                  <li>
                    <button
                      className="pm-dropdown-item"
                      onClick={() => handleGenreSelect("All Genres")}
                      role="option"
                      aria-selected={selectedGenre === "All Genres"}
                    >
                      All Genres
                    </button>
                  </li>
                  {genres.map((genre, index) => (
                    <li key={index}>
                      <button
                        className="pm-dropdown-item"
                        onClick={() => handleGenreSelect(genre)}
                        role="option"
                        aria-selected={selectedGenre === genre}
                      >
                        {genre}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pm-view-toggle">
              <button
                className={`pm-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H6V8H2V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 4H14V8H10V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 10H6V14H2V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 10H14V14H10V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={`pm-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* PRODUCT GRID/LIST */}
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : viewMode === 'grid' ? (
            <div className="album-grid">
              {filteredProducts.map((product) => {
                // Calculate URL inside map scope
                const imageUrl = getImageUrl(product.album_cover_img);

                return (
                  <div key={product.product_id} className={`album-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {/* IMAGE DISPLAY using album_cover_img */}
                    <div 
                      className="album-img" 
                      
                    >
                      {product.stock === 0 && <div className="out-of-stock-label">Out of Stock</div>}
                      <img src={getImageUrl(product.album_cover_img)} className="mp-album-img" />
                      {/* If the image fails to load, ensure the URL returned by PHP is correct (e.g., http://localhost/uploads/album.jpg) */}
                    </div>

                    <div className="album-info">
                    <h4>
                      {product.album_title} <span className="stock-count">({product.stock} left)</span>
                    </h4>
                    <p>{product.artist}</p>
                    

                    <div className="price-details-box">
                      <div className="price-details-row">
                        <p className="price">₱{product.price}</p>

                        <button className="details-btn" onClick={() => {
                          setSelectedAlbum(product);
                          setShowDetails(true);
                        }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20284 7.203C1.15423 7.07203 1.15423 6.92796 1.20284 6.797C1.67634 5.64891 2.48006 4.66727 3.51213 3.97652C4.54419 3.28577 5.75812 2.91702 7.00001 2.91702C8.2419 2.91702 9.45583 3.28577 10.4879 3.97652C11.52 4.66727 12.3237 5.64891 12.7972 6.797C12.8458 6.92796 12.8458 7.07203 12.7972 7.203C12.3237 8.35108 11.52 9.33272 10.4879 10.0235C9.45583 10.7142 8.2419 11.083 7.00001 11.083C5.75812 11.083 4.54419 10.7142 3.51213 10.0235C2.48006 9.33272 1.67634 8.35108 1.20284 7.203Z" stroke="#717182" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z" stroke="#717182" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Details
                        </button>
                      
                      </div>
                    </div>
                    
                    {/* BODY */}

                    <button
                      className="album-add-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_50_2259)">
                          <path d="M5.33329 14.6667C5.70148 14.6667 5.99996 14.3682 5.99996 14C5.99996 13.6318 5.70148 13.3333 5.33329 13.3333C4.9651 13.3333 4.66663 13.6318 4.66663 14C4.66663 14.3682 4.9651 14.6667 5.33329 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.6667 14.6667C13.0349 14.6667 13.3333 14.3682 13.3333 14C13.3333 13.6318 13.0349 13.3333 12.6667 13.3333C12.2985 13.3333 12 13.6318 12 14C12 14.3682 12.2985 14.6667 12.6667 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.3667 1.36667H2.70003L4.47337 9.64667C4.53842 9.94991 4.70715 10.221 4.95051 10.4132C5.19387 10.6055 5.49664 10.7069 5.8067 10.7H12.3267C12.6301 10.6995 12.9244 10.5955 13.1607 10.4052C13.3971 10.2149 13.5615 9.94969 13.6267 9.65333L14.7267 4.7H3.41337" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_50_2259">
                            <rect width="16" height="16" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="album-list">
              {filteredProducts.map((product) => {
                return (
                  <div key={product.product_id} className={`album-card ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {/* IMAGE DISPLAY using album_cover_img */}
                    <div 
                      className="album-img" 
                      
                    >
                      {product.stock === 0 && <div className="out-of-stock-label">Out of Stock</div>}
                      <img src={getImageUrl(product.album_cover_img)} className="mp-album-img" />
                      {/* If the image fails to load, ensure the URL returned by PHP is correct (e.g., http://localhost/uploads/album.jpg) */}
                    </div>

                    <div className="album-info">
                    <h4>
                      {product.album_title} <span className="stock-count">({product.stock} left)</span>
                    </h4>
                    <p>{product.artist}</p>
                    

                    <div className="price-details-box">
                      <div className="price-details-row">
                        <p className="price">₱{product.price}</p>

                        <button className="details-btn" onClick={() => {
                          setSelectedAlbum(product);
                          setShowDetails(true);
                        }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.20284 7.203C1.15423 7.07203 1.15423 6.92796 1.20284 6.797C1.67634 5.64891 2.48006 4.66727 3.51213 3.97652C4.54419 3.28577 5.75812 2.91702 7.00001 2.91702C8.2419 2.91702 9.45583 3.28577 10.4879 3.97652C11.52 4.66727 12.3237 5.64891 12.7972 6.797C12.8458 6.92796 12.8458 7.07203 12.7972 7.203C12.3237 8.35108 11.52 9.33272 10.4879 10.0235C9.45583 10.7142 8.2419 11.083 7.00001 11.083C5.75812 11.083 4.54419 10.7142 3.51213 10.0235C2.48006 9.33272 1.67634 8.35108 1.20284 7.203Z" stroke="#717182" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z" stroke="#717182" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Details
                        </button>
                      
                      </div>
                    </div>
                    
                    {/* BODY */}

                    <button
                      className="album-add-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_50_2259)">
                          <path d="M5.33329 14.6667C5.70148 14.6667 5.99996 14.3682 5.99996 14C5.99996 13.6318 5.70148 13.3333 5.33329 13.3333C4.9651 13.3333 4.66663 13.6318 4.66663 14C4.66663 14.3682 4.9651 14.6667 5.33329 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.6667 14.6667C13.0349 14.6667 13.3333 14.3682 13.3333 14C13.3333 13.6318 13.0349 13.3333 12.6667 13.3333C12.2985 13.3333 12 13.6318 12 14C12 14.3682 12.2985 14.6667 12.6667 14.6667Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1.3667 1.36667H2.70003L4.47337 9.64667C4.53842 9.94991 4.70715 10.221 4.95051 10.4132C5.19387 10.6055 5.49664 10.7069 5.8067 10.7H12.3267C12.6301 10.6995 12.9244 10.5955 13.1607 10.4052C13.3971 10.2149 13.5615 9.94969 13.6267 9.65333L14.7267 4.7H3.41337" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_50_2259">
                            <rect width="16" height="16" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                  </div>
                );
              })}
            </div>
          )}

          {showDetails && selectedAlbum && (
            <div className="details-modal-overlay">
              <div className="details-modal">

                {/* HEADER */}
                <div className="details-modal-header">
                  <button className="back-btn" onClick={() => setShowDetails(false)}>←</button>
                  <h2>Album Details</h2>
                  <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
                </div>

                {/* BODY */}
                <div className="details-modal-body">

                  {/* LEFT PANEL: Image */}
                  <div className="details-left">
                    <div 
                      className="album-main-img" 
                    >
                      <img src={getImageUrl(selectedAlbum.album_cover_img)} className="de-album-img" />
                      {/* Image will be displayed here via CSS background-image */}
                    </div>
                  </div>

                  {/* RIGHT PANEL: Info */}
                  <div className="details-right">
                    <h1 className="album-title">{selectedAlbum.album_title}</h1>
                    <p className="album-subtitle">{selectedAlbum.artist}</p>

                    {/* Tags / Badges */}
                    <div className="album-tags">
                      <span className="tag">{selectedAlbum.genre}</span>
                    </div>

                    {/* Price */}
                    <p className="album-price">₱{selectedAlbum.price}</p>

                    {/* Stock */}
                    <p className="album-stock">Stock: {selectedAlbum.stock}</p>

                    {/* Description */}
                    <div className="album-description">
                      <h3>Description</h3>
                      <p>{selectedAlbum.description || 'No description available.'}</p>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="album-add-cart-btn" disabled={selectedAlbum.stock === 0} onClick={() => {
                      addToCart(selectedAlbum);     // Add to cart
                      setShowDetails(false);         // Close the details modal
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.3667 1.36667H2.70003L4.47337 9.64667C4.53842 9.94991 4.70715 10.221 4.95051 10.4132C5.19387 10.6055 5.49664 10.7069 5.8067 10.7H12.3267C12.6301 10.6995 12.9244 10.5955 13.1607 10.4052C13.3971 10.2149 13.5615 9.94969 13.6267 9.65333L14.7267 4.7H3.41337" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {selectedAlbum.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showAddCartModal && (
            <div className="modal-overlay">
              <div className="modal-container">

                <h2>Added to Cart</h2>
                <p>Your item has been successfully added to your cart.</p>

                <div className="modal-actions">
                  <button onClick={() => setShowAddCartModal(false)} className="close-btn">
                    Close
                  </button>

                  <Link to="/buyer/cart">
                    <button className="go-to-cart-btn">Go to Cart</button>
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
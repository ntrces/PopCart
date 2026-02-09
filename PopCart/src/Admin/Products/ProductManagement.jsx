import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import "./ProductManagement.css";
import Modal from "../Users/Modal.jsx";
import AddProduct from "./AddProduct.jsx";
import EditProduct from "./EditProduct.jsx";
import DeleteProduct from "./DeleteProduct.jsx";
import image from "../../assets/image.png";
import getImageUrl from "../../utils/getImageUrl";
import Header from "../Header/HeaderA.jsx";
import Sidebar from "../Sidebar/SidebarA.jsx";

function ProductManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const filteredData = useMemo(() => {
    return tableData.filter(row => {
      const matchesSearch = searchValue === '' || 
        row.album_title.toLowerCase().includes(searchValue.toLowerCase()) || 
        row.artist.toLowerCase().includes(searchValue.toLowerCase());
      const matchesGenre = selectedGenre === 'All Genres' || row.genre.toLowerCase() === selectedGenre.toLowerCase();
      return matchesSearch && matchesGenre;
    });
  }, [tableData, searchValue, selectedGenre]);

  const genres = [
    "All Genres",
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Hip Hop",
    "Electronic",
    "Country",
    "R&B",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/get_products.php');
      const data = await response.json();
      if (data.success) {
        setTableData(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const headers = [
    { label: "Album", align: "left" },
    { label: "Artist", align: "left" },
    { label: "Genre", align: "left" },
    { label: "Price", align: "left" },
    { label: "Stock", align: "left" },
    { label: "Year", align: "left" },
    { label: "Actions", align: "center" },
  ];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectedProduct(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="admin-layout">
          <Header className="admin-header" />
          <div className="admin-content-wrapper">
    
            <Sidebar className="admin-sidebar" onSignOutClick={() => setShowSignOutModal(true)} />
    
            <main className="admin-main-content">

    <div className="pm-page">
      <div className="pm-container">
        <header className="pm-header">
          <div className="pm-header-content">
            <h1 className="pm-title">Product Management</h1>
            <p className="pm-subtitle">Manage album inventory and details</p>
          </div>

          <button
            className="pm-add-btn"
            type="button"
            aria-label="Add Product"
            onClick={handleOpenAdd}
          >
            <div className="pm-add-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.3335 8H12.6668" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33331V12.6666" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="pm-add-text">Add Product</span>
          </button>
        </header>

        <div className="pm-controls">
          <div className="pm-search">
            <label htmlFor="search-input" className="pm-search-label">
              <input
                id="search-input"
                className="pm-search-input"
                placeholder="Search by title or artist..."
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
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
        </div>

        <div className="pm-table-wrapper">
          <div className="pm-table">
            <header className="pm-table-head">
              <div className="pm-table-row">
                {headers.map((header, i) => (
                  <div key={i} className="pm-th">
                    <div className={`pm-th-text ${header.align === "right" ? "align-right" : header.align === "center" ? "align-center" : ""}`}>
                      {header.label}
                    </div>
                  </div>
                ))}
              </div>
            </header>

            <div className="pm-table-body">
              {filteredData.map((row) => (
                <div key={row.product_id} className={`pm-table-row ${row.stock == 0 ? 'out-of-stock-row' : ''}`}>
                  <div className="pm-table-cell album-cell">
                    {row.album_cover_img ? (
                      <img src={getImageUrl(row.album_cover_img)} alt={row.album_title} className="pm-album-image" />
                    ) : (
                      <img src={image} alt={row.album_title} className="pm-album-image" />
                    )}
                    <span className="pm-album-name" title={row.album_title}>{row.album_title}</span>
                  </div>

                  <div className="pm-table-cell">
                    <span className="pm-text-truncate" title={row.artist}>{row.artist}</span>
                  </div>

                  <div className="pm-table-cell">
                    <div className="pm-genre-badge pm-text-truncate" title={row.genre}>{row.genre}</div>
                  </div>

                  <div className="pm-table-cell">
                    <span className="pm-text-truncate" title={`₱${parseFloat(row.price).toFixed(2)}`}>₱{parseFloat(row.price).toFixed(2)}</span>
                  </div>

                  <div className="pm-table-cell">
                    <span className="pm-text-truncate" title={row.stock}>{row.stock}</span>
                  </div>

                  <div className="pm-table-cell">
                    <span className="pm-text-truncate" title={row.released_year}>{row.released_year}</span>
                  </div>

                  <div className="pm-table-cell actions-cell">
                    <div className="pm-actions-group">
                      <button
                        className="pm-action-btn edit"
                        onClick={() => handleOpenEdit(row)}
                        aria-label={`Edit ${row.album_title}`}
                        type="button"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8" stroke="#2B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.2499 1.75003C12.5151 1.48481 12.8748 1.33582 13.2499 1.33582C13.625 1.33582 13.9847 1.48481 14.2499 1.75003C14.5151 2.01525 14.6641 2.37496 14.6641 2.75003C14.6641 3.1251 14.5151 3.48481 14.2499 3.75003L8.24123 9.75936C8.08293 9.91753 7.88737 10.0333 7.67257 10.096L5.75723 10.656C5.69987 10.6728 5.63906 10.6738 5.58117 10.6589C5.52329 10.6441 5.47045 10.614 5.4282 10.5717C5.38594 10.5295 5.35583 10.4766 5.341 10.4188C5.32617 10.3609 5.32717 10.3001 5.3439 10.2427L5.9039 8.32736C5.96692 8.11273 6.08292 7.9174 6.24123 7.75936L12.2499 1.75003Z" stroke="#2B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      <button
                        className="pm-action-btn delete"
                        onClick={() => handleOpenDelete(row)}
                        aria-label={`Delete ${row.album_title}`}
                        type="button"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.66675 7.33331V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.33325 7.33331V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12.6666 4V13.3333C12.6666 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97382 14.5262 3.72378 14.2761C3.47373 14.0261 3.33325 13.687 3.33325 13.3333V4" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 4H14" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33325 3.99998V2.66665C5.33325 2.31302 5.47373 1.97389 5.72378 1.72384C5.97383 1.47379 6.31296 1.33331 6.66659 1.33331H9.33325C9.68687 1.33331 10.026 1.47379 10.2761 1.72384C10.5261 1.97389 10.6666 2.31302 10.6666 2.66665V3.99998" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <Modal onClose={handleCloseAdd}>
          <AddProduct onClose={handleCloseAdd} onAdd={fetchProducts} />
        </Modal>
      )}

      {showEditModal && (
        <Modal onClose={handleCloseEdit}>
          <EditProduct product={selectedProduct} onClose={handleCloseEdit} onUpdate={fetchProducts} />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={handleCloseDelete}>
          <DeleteProduct product={selectedProduct} onClose={handleCloseDelete} onDelete={fetchProducts} />
        </Modal>
      )}
    </div>
            </main>
          </div>

          {showSignOutModal && (
            <div className="modal-overlay">
              <div className="signout-modal">
                <h3>Sign Out</h3>
                <p>Are you sure you want to sign out?</p>

                <div className="modal-buttons">
                  <button className="cancel-btn" onClick={() => setShowSignOutModal(false)}>
                    Cancel
                  </button>

                  <button className="confirm-btn" onClick={async () => { await logout(); setShowSignOutModal(false); navigate('/signin'); }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>  
  );
}

export default ProductManagement;
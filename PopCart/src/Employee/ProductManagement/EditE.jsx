import React, { useState, useEffect } from "react";
import "./EditE.css";
import getImageUrl from "../../utils/getImageUrl";

function EditE({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    albumTitle: "",
    artist: "",
    price: "",
    stockQuantity: "",
    genre: "",
    releasedYear: "",
    albumCoverImage: null,
    description: "",
  });
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/get_product.php?product_id=${product.product_id}`);
        const data = await response.json();
        if (data.success) {
          const p = data.product;
          setCurrentProduct(p);
          setFormData({
            albumTitle: p.album_title,
            artist: p.artist,
            price: p.price,
            stockQuantity: p.stock,
            genre: p.genre,
            releasedYear: p.released_year,
            description: p.description,
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    if (product.product_id) {
      fetchProduct();
    }
  }, [product.product_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      albumCoverImage: file,
    }));
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showFileInput && !formData.albumCoverImage) {
      alert('Please upload a new album cover image.');
      return;
    }
    const data = new FormData();
    data.append('product_id', product.product_id);
    data.append('price', formData.price);
    data.append('stock', formData.stockQuantity);
    if (formData.albumCoverImage) {
      data.append('album_cover_img[]', formData.albumCoverImage);
    }
    try {
      const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/update_product.php', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      if (result.success) {
        alert('Product updated successfully');
        if (onUpdate) onUpdate();
        if (onClose) onClose();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <div className="ap-container">
      <header className="ap-header">
        <div className="ap-header-left">
          <h1 className="ap-title">Edit Product Details</h1>
          <p className="ap-subtitle">Update authentic album details on sale for Pop Cart</p>
        </div>

        <button
          type="button"
          className="ap-close-btn"
          aria-label="Close"
          onClick={() => onClose && onClose()}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L15 15" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <form className="ap-form" onSubmit={handleSubmit}>
        <div className="ap-row">
          <div className="ap-field">
            <label htmlFor="albumTitle" className="ap-label">Album Title *</label>
            <input
              type="text"
              id="albumTitle"
              name="albumTitle"
              value={formData.albumTitle}
              disabled
              className="ap-input"
            />
          </div>

          <div className="ap-field">
            <label htmlFor="artist" className="ap-label">Artist *</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              disabled
              className="ap-input"
            />
          </div>
        </div>

        <div className="ap-row">
          <div className="ap-field">
            <label htmlFor="price" className="ap-label">Price (₱) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.01"
              required
              className="ap-input"
            />
          </div>

          <div className="ap-field">
            <label htmlFor="stockQuantity" className="ap-label">Stock Quantity</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="ap-input"
            />
          </div>
        </div>

        <div className="ap-row">
          <div className="ap-field">
            <label htmlFor="genre" className="ap-label">Genre *</label>
            <div className="ap-select-wrap">
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                disabled
                className="ap-select"
              >
                <option value="">Select genre</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="hiphop">Hip Hop</option>
                <option value="electronic">Electronic</option>
                <option value="country">Country</option>
                <option value="rnb">R&B</option>
              </select>
            </div>
          </div>

          <div className="ap-field">
            <label htmlFor="releasedYear" className="ap-label">Released Year *</label>
            <div className="ap-select-wrap">
              <select
                id="releasedYear"
                name="releasedYear"
                value={formData.releasedYear}
                disabled
                className="ap-select"
              >
                <option value="">Select year</option>
                {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="ap-field">
          <label className="ap-label">Current Album Cover Image</label>
          {currentProduct && currentProduct.album_cover_img && (
            <img src={getImageUrl(currentProduct.album_cover_img)} alt="Current Album Cover" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          )}
        </div>

        <div className="ap-field">
          <label className="ap-label">Album Cover Image Path</label>
          {!showFileInput ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={currentProduct ? currentProduct.album_cover_img : ''}
                readOnly
                className="ap-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowFileInput(true)}
                style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Remove image"
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
          ) : !selectedFile ? (
            <input
              type="file"
              id="albumCoverImage"
              name="albumCoverImage"
              onChange={handleFileChange}
              accept="image/*"
              className="ap-file-input"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1 }}>{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setFormData((prev) => ({ ...prev, albumCoverImage: null }));
                }}
                style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Remove image"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66675 7.33334V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.33325 7.33334V11.3333" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.6666 4V13.3333C12.6666 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97382 14.5262 3.72378 14.2761C3.47373 14.0261 3.33325 13.687 3.33325 13.3333V4" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 4H14" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33325 4V2.66667C5.33325 2.31304 5.47373 1.9739 5.72378 1.72386C5.97383 1.47381 6.31296 1.33333 6.66659 1.33333H9.33325C9.68687 1.33333 10.026 1.47381 10.2761 1.72386C10.5261 1.9739 10.6666 2.31304 10.6666 2.66667V4" stroke="#E7000B" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="ap-field">
          <label htmlFor="description" className="ap-label">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            disabled
            rows={4}
            className="ap-textarea"
          />
          <p className="ap-help">Minimum 25 characters</p>
        </div>

        <div className="ap-actions">
          <button type="button" className="ap-cancel-btn" onClick={() => onClose && onClose()}>
            Cancel
          </button>

          <button type="submit" className="ap-submit-btn">
            Update Album
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditE;

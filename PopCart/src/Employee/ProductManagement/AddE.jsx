import React, { useState } from "react";
import "./AddE.css";

function AddE ({ onClose, onAdd }) {
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
  const [selectedFile, setSelectedFile] = useState(null);

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
    if (!formData.albumCoverImage) {
      alert('Please upload an album cover image.');
      return;
    }
    const data = new FormData();
    data.append('album_title', formData.albumTitle);
    data.append('artist', formData.artist);
    data.append('price', formData.price);
    data.append('stock', formData.stockQuantity);
    data.append('genre', formData.genre);
    data.append('released_year', formData.releasedYear);
    data.append('description', formData.description);
    data.append('album_cover_img[]', formData.albumCoverImage);
    try {
      const response = await fetch('http://localhost/popcart-api/add_product.php', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      if (result.success) {
        alert('Product added successfully');
        if (onAdd) onAdd();
        if (onClose) onClose();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  return (
    <div className="ap-container">
      <header className="ap-header">
        <div className="ap-header-left">
          <h1 className="ap-title">Add New Product</h1>
          <p className="ap-subtitle">List an authentic album for sale on Pop Cart</p>
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
              onChange={handleInputChange}
              placeholder="e.g., Abbey Road"
              required
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
              onChange={handleInputChange}
              placeholder="e.g., The Beatles"
              required
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
                onChange={handleInputChange}
                required
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
                onChange={handleInputChange}
                required
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
          <label htmlFor="albumCoverImage" className="ap-label">Album Cover Image *</label>
          {!selectedFile ? (
            <input
              type="file"
              id="albumCoverImage"
              name="albumCoverImage"
              onChange={handleFileChange}
              accept="image/*"
              required
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
          <p className="ap-help">Upload the album cover image</p>
        </div>

        <div className="ap-field">
          <label htmlFor="description" className="ap-label">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the album's condition, any special features, etc. (minimum 25 characters)"
            minLength={25}
            required
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
            Add Album
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddE;
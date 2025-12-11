import React, { useState } from "react";
import "./AddE.css";

function AddE ({ onClose }) {
  const [formData, setFormData] = useState({
    albumTitle: "",
    artist: "",
    price: "",
    stockQuantity: "",
    genre: "",
    releasedYear: "",
    albumCoverImages: null,
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      albumCoverImages: e.target.files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (onClose) onClose();
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
                {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="ap-field">
          <label htmlFor="albumCoverImages" className="ap-label">Album Cover Images *</label>
          <input
            type="file"
            id="albumCoverImages"
            name="albumCoverImages"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            required
            className="ap-file-input"
          />
          <p className="ap-help">Upload at least 2 images of the album (front cover, back cover, etc.)</p>
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
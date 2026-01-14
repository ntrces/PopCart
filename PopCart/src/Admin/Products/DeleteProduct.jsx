import React from "react";
import "./DeleteProduct.css";

export default function DeleteProduct ({ product, onClose, onDelete }) {
  const handleCancel = () => {
    console.log("Cancel clicked");
    onClose();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/delete_product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.product_id })
      });
      const result = await response.json();
      if (result.success) {
        alert('Product deleted successfully');
        if (onDelete) onDelete();
        onClose();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div
      className="delete-dialog"
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="delete-content">
        <header className="delete-header">
          <h1 id="dialog-title" className="delete-title">
            Delete Product
          </h1>

          <p id="dialog-description" className="delete-description">
            Are you sure you want to delete this product?
          </p>
        </header>

        <div className="delete-actions">
          <button
            onClick={handleCancel}
            type="button"
            aria-label="Cancel deletion"
            className="delete-cancel-btn"
          >
            <span>Cancel</span>
          </button>

          <button
            onClick={handleDelete}
            type="button"
            aria-label="Confirm deletion"
            className="delete-confirm-btn"
          >
            <div className="delete-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.66675 7.33334V11.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.33325 7.33334V11.3333" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.6666 4V13.3333C12.6666 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66659C4.31296 14.6667 3.97382 14.5262 3.72378 14.2761C3.47373 14.0261 3.33325 13.687 3.33325 13.3333V4" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 4H14" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33325 4V2.66667C5.33325 2.31304 5.47373 1.9739 5.72378 1.72386C5.97383 1.47381 6.31296 1.33333 6.66659 1.33333H9.33325C9.68687 1.33333 10.026 1.47381 10.2761 1.72386C10.5261 1.9739 10.6666 2.31304 10.6666 2.66667V4" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <span className="delete-btn-text">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

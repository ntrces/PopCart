import React, { useState } from "react";
import "./Edit.css";


function Edit ({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-user-form">
      <header className="add-user-header">
        <h1 className="add-user-title">Update User Information</h1>

        <button type="button" className="close-button" aria-label="Close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 5L5 15" stroke="#6B7280" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 5L15 15" stroke="#6B7280" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </button>
      </header>

      <div className="fields-container">
        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="name" className="label">
              Name:
            </label>
          </div>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="email" className="label">
              Email:
            </label>
          </div>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="password" className="label">
              Password:
            </label>
          </div>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="role" className="label">
              Role
            </label>
          </div>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="select"
            required
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="moderator">Employee</option>
          </select>
        </div>
      </div>

      <div className="button-container">
        <button
          type="button"
          onClick={handleCancel}
          className="cancel-button"
        >
          <span className="cancel-button-text">Cancel</span>
        </button>

        <button
          type="submit"
          className="submit-button"
        >
          <span className="submit-button-text">Update User</span>
        </button>
      </div>
    </form>
  );
};

export default Edit;
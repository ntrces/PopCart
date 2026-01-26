import React, { useState } from "react";
import "./AddUser.css";

function AddUser ({ onClose, onSuccess, currentUser, isFirstAdmin }) {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    usertype: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch('http://localhost/PopCart1/PopCart/PopCart/src/popcart-api/add_user.php', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastname: formData.lastname,
          firstname: formData.firstname,
          email: formData.email,
          birthday: formData.birthday,
          password: formData.password,
          usertype: formData.usertype,
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('User added successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const handleCancel = () => {
    setFormData({
      lastname: "",
      firstname: "",
      email: "",
      birthday: "",
      password: "",
      confirmPassword: "",
      usertype: "",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="add-user-form">
      <header className="add-user-header">
        <h1 className="add-user-title">Add New User</h1>

        <button type="button" className="close-button" aria-label="Close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L15 15" stroke="#6B7280" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>

      <div className="fields-container">
        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="lastname" className="label">
              Last Name:
            </label>
          </div>

          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="firstname" className="label">
              First Name:
            </label>
          </div>

          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
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
            <label htmlFor="birthday" className="label">
              Birthday:
            </label>
          </div>

          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            className="input"
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
            <label htmlFor="confirmPassword" className="label">
              Confirm Password:
            </label>
          </div>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label htmlFor="usertype" className="label">
              Role
            </label>
          </div>

          <select
            id="usertype"
            name="usertype"
            value={formData.usertype}
            onChange={handleInputChange}
            className="select"
            required
          >
            <option value="">Select a role</option>
            <option value="buyer">Buyer</option>
            <option value="employee">Employee</option>
            {isFirstAdmin && <option value="admin">Admin</option>}
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
          <span className="submit-button-text">Add User</span>
        </button>
      </div>
    </form>
  );
};

export default AddUser;
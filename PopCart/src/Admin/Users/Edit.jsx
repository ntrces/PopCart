import React, { useState, useEffect } from "react";
import "./Edit.css";


function Edit ({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    usertype: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        usertype: user.usertype || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if changing role and if it's the last admin
    if (user.usertype === 'admin' && formData.usertype !== 'admin') {
      // Check active admin count
      try {
        const response = await fetch('http://localhost/popcart-api/get_user_counts.php');
        const data = await response.json();
        if (data.success && data.counts.admin <= 1) {
          alert('Cannot change role: At least one active admin must remain.');
          return;
        }
      } catch (error) {
        console.error('Error checking admin count:', error);
        alert('Failed to verify admin count.');
        return;
      }
    }
    const data = new FormData();
    data.append('user_id', user.user_id);
    data.append('usertype', formData.usertype);
    try {
      const response = await fetch('http://localhost/popcart-api/update_user.php', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      if (result.success) {
        alert('User updated successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleCancel = () => {
    setFormData({ usertype: user.usertype || "" });
  };

  const getRoleOptions = () => {
    if (!user) return [];
    switch (user.usertype) {
      case 'buyer':
        return [
          { value: 'employee', label: 'Employee' },
          { value: 'admin', label: 'Admin' }
        ];
      case 'employee':
        return [
          { value: 'buyer', label: 'Buyer' },
          { value: 'admin', label: 'Admin' }
        ];
      case 'admin':
        return [
          { value: 'buyer', label: 'Buyer' },
          { value: 'employee', label: 'Employee' }
        ];
      default:
        return [];
    }
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
            <label className="label">
              Name:
            </label>
          </div>

          <input
            type="text"
            value={`${user?.firstname || ""} ${user?.lastname || ""}`.trim()}
            className="input"
            readOnly
          />
        </div>

        <div className="field-group">
          <div className="label-wrapper">
            <label className="label">
              Email:
            </label>
          </div>

          <input
            type="email"
            value={user?.email || ""}
            className="input"
            readOnly
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
            <option value={user?.usertype || ""}>{user?.usertype || ""}</option>
            {getRoleOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
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
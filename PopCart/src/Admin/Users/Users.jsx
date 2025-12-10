import React, { useState } from "react";
import "./Users.css";
import Delete from "./Delete.jsx";
import EditUser from "./Edit.jsx";
import AddUser from "./AddUser.jsx";
import Modal from "./Modal.jsx";

export default function Users() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  return (
    <main className="users-page">
      <div className="users-container">
        <UserManagementSection onAdd={handleOpenAdd} />
        <UserSearchFilterSection />
        <UserTableSection onEdit={handleOpenEdit} onDelete={handleOpenDelete} />
      </div>

      {showAddModal && (
        <Modal onClose={handleCloseAdd}>
          <AddUser onClose={handleCloseAdd} />
        </Modal>
      )}

      {showEditModal && (
        <Modal onClose={handleCloseEdit}>
          <EditUser user={selectedUser} onClose={handleCloseEdit} />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={handleCloseDelete}>
          <Delete user={selectedUser} onClose={handleCloseDelete} />
        </Modal>
      )}
    </main>
  );
}

const UserManagementSection = ({ onAdd }) => {
  return (
    <header className="ums-header">
      <div className="ums-title-group">
        <h1 className="ums-title">User Management</h1>
        <p className="ums-subtitle">Manage all user accounts</p>
      </div>

      <button 
        className="ums-add-btn" 
        type="button" 
        aria-label="Add User"
        onClick={onAdd}
        >
        <div className="ums-add-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6666 14V12.6667C10.6666 11.9594 10.3856 11.2811 9.88554 10.781C9.38544 10.281 8.70716 10 7.99992 10H3.99992C3.29267 10 2.6144 10.281 2.1143 10.781C1.6142 11.2811 1.33325 11.9594 1.33325 12.6667V14" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.99992 7.33333C7.47268 7.33333 8.66659 6.13943 8.66659 4.66667C8.66659 3.19391 7.47268 2 5.99992 2C4.52716 2 3.33325 3.19391 3.33325 4.66667C3.33325 6.13943 4.52716 7.33333 5.99992 7.33333Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.6667 5.33331V9.33331" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.6667 7.33331H10.6667" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="ums-add-text">Add User</span>
      </button>
    </header>
  );
};

const UserSearchFilterSection = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="usf-wrapper">
      <div className="search-and-filter">
        <label className="search-label" htmlFor="search-input">
          <input
            id="search-input"
            className="search-input"
            placeholder="Search by title or artist..."
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search by title or artist"
          />
        </label>
      </div>
    </div>
  );
};

const UserTableSection = ({ onEdit, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "All (5)", count: 5 },
    { id: "customer", label: "Customer (3)", count: 3 },
    { id: "employee", label: "Employee (1)", count: 1 },
    { id: "admin", label: "Admin (1)", count: 1 },
  ];

  const userData = [
    {
      id: 1,
      name: "John Customer",
      email: "customer@demo.com",
      role: "customer",
      roleColor: "role-badge-blue",
      roleTextColor: "role-text-blue",
      joinedDate: "Oct 15, 2025",
      status: "active",
      avatar: "J",
    },
    {
      id: 2,
      name: "Jane Employee",
      email: "employee@demo.com",
      role: "employee",
      roleColor: "role-badge-green",
      roleTextColor: "role-text-green",
      joinedDate: "Sep 20, 2025",
      status: "active",
      avatar: "J",
    },
    {
      id: 3,
      name: "Admin",
      email: "admin@demo.com",
      role: "admin",
      roleColor: "role-badge-red",
      roleTextColor: "role-text-red",
      joinedDate: "Aug 1, 2025",
      status: "active",
      avatar: "A",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "customer",
      roleColor: "role-badge-blue",
      roleTextColor: "role-text-blue",
      joinedDate: "Nov 1, 2025",
      status: "active",
      avatar: "S",
    },
  ];

  const tableHeaders = ["User", "Email", "Role", "Joined Date", "Status", "Actions"];

  return (
    <section className="ut-section">
      <nav className="ut-tabs" role="tablist" aria-label="User filter tabs">
        {filterButtons.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`ut-tab ${activeFilter === filter.id ? "active" : ""}`}
            role="tab"
            aria-selected={activeFilter === filter.id}
            aria-controls={`${filter.id}-panel`}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </nav>

      <div className="ut-card">
        <div className="ut-table">
          <div className="ut-table-head">
            <div className="ut-table-row">
              {tableHeaders.map((header, i) => (
                <div key={i} className="ut-th">
                  <div className={`ut-th-text ${header === "Actions" ? "align-right" : ""}`}>{header}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ut-table-body">
            {userData.map((user) => (
              <div key={user.id} className="ut-row">
                <div className="ut-cell user-cell">
                  <div className="user-avatar">{user.avatar}</div>
                  <div className="user-name">{user.name}</div>
                </div>

                <div className="ut-cell">{user.email}</div>

                <div className="ut-cell">
                  <div className="role-wrap">
                    <div className={`role-badge ${user.roleColor}`}>
                      <span className={`role-text ${user.roleTextColor}`}>{user.role}</span>
                    </div>
                  </div>
                </div>

                <div className="ut-cell">
                  <time className="joined-date">{user.joinedDate}</time>
                </div>

                <div className="ut-cell">
                  <button className="status-btn" aria-label={`Status: ${user.status}`}>{user.status}</button>
                </div>

                <div className="ut-cell actions-cell">
                  <div className="actions-group">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.name}`}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8" stroke="#2B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.2499 1.75003C12.5151 1.48481 12.8748 1.33582 13.2499 1.33582C13.625 1.33582 13.9847 1.48481 14.2499 1.75003C14.5151 2.01525 14.6641 2.37496 14.6641 2.75003C14.6641 3.1251 14.5151 3.48481 14.2499 3.75003L8.24123 9.75936C8.08293 9.91753 7.88737 10.0333 7.67257 10.096L5.75723 10.656C5.69987 10.6728 5.63906 10.6738 5.58117 10.6589C5.52329 10.6441 5.47045 10.614 5.4282 10.5717C5.38594 10.5295 5.35583 10.4766 5.341 10.4188C5.32617 10.3609 5.32717 10.3001 5.3439 10.2427L5.9039 8.32736C5.96692 8.11273 6.08292 7.9174 6.24123 7.75936L12.2499 1.75003Z" stroke="#2B7FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(user)}
                      aria-label={`Delete ${user.name}`}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    </section>
  );
};
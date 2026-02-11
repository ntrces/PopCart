import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import { apiUrl } from "../../utils/api.js";
import "./Users.css";
import Delete from "./Delete.jsx";
import EditUser from "./Edit.jsx";
import AddUser from "./AddUser.jsx";
import Modal from "./Modal.jsx";
import Header from "../Header/HeaderA.jsx";
import Sidebar from "../Sidebar/SidebarA.jsx";

export default function Users() {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({ all: 0, customer: 0, employee: 0, admin: 0 });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (authUser?.user_id) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  const fetchCounts = async () => {
    try {
      const response = await fetch(apiUrl('get_user_counts.php'));
      const data = await response.json();
      if (data.success) {
        setCounts(data.counts);
      }
    } catch (error) {
      console.error('Error fetching user counts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(apiUrl('get_users.php'));
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchUsers();
  }, []);

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  const handleOpenEdit = (user) => {
    // Prevent editing own account
    if (currentUser && user.user_id === currentUser.user_id) {
      alert("You cannot edit your own account.");
      return;
    }
    // Prevent editing SuperAdmin users
    if (user.usertype === 'SuperAdmin') {
      alert("You cannot edit Super Admin users.");
      return;
    }
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  const handleOpenDelete = (user) => {
    // Prevent deleting own account
    if (currentUser && user.user_id === currentUser.user_id) {
      alert("You cannot delete your own account.");
      return;
    }
    // Prevent deleting SuperAdmin users
    if (user.usertype === 'SuperAdmin') {
      alert("You cannot delete Super Admin users.");
      return;
    }
    setSelectedUser(user);
    setShowDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  return (
 <div className="admin-layout">
      <Header className="admin-header" />
      <div className="admin-content-wrapper">

        <Sidebar className="admin-sidebar" onSignOutClick={() => setShowSignOutModal(true)} />

        <main className="admin-main-content">
    <div className="users-page">
      <div className="users-container">
        <UserManagementSection onAdd={handleOpenAdd} />
        <UserSearchFilterSection searchValue={searchValue} setSearchValue={setSearchValue} />
        <UserTableSection 
          onEdit={handleOpenEdit} 
          onDelete={handleOpenDelete} 
          searchValue={searchValue} 
          users={users} 
          counts={counts} 
          currentUser={currentUser}
        />

      </div>

      {showAddModal && (
        <Modal onClose={handleCloseAdd}>
          <AddUser 
            onClose={handleCloseAdd} 
            onSuccess={() => { fetchUsers(); fetchCounts(); }} 
            currentUser={currentUser}
          />
        </Modal>
      )}

      {showEditModal && (
        <Modal onClose={handleCloseEdit}>
          <EditUser 
            user={selectedUser} 
            onClose={handleCloseEdit} 
            onSuccess={() => { fetchUsers(); fetchCounts(); }} 
            currentUser={currentUser}
          />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={handleCloseDelete}>
          <Delete 
            user={selectedUser} 
            onClose={handleCloseDelete} 
            onSuccess={() => { fetchUsers(); fetchCounts(); }} 
            currentUser={currentUser} 
          />
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

const UserSearchFilterSection = ({ searchValue, setSearchValue }) => {
  return (
    <div className="usf-wrapper">
      <div className="search-and-filter">
        <label className="search-label" htmlFor="search-input">
          <input
            id="search-input"
            className="search-input"
            placeholder="Search by name or email"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search by name or email"
          />
        </label>
      </div>
    </div>
  );
};

const UserTableSection = ({ onEdit, onDelete, searchValue, users, counts, currentUser }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const isSuperAdminUser = (user) => {
    return user.usertype === 'SuperAdmin';
  };

  const isCurrentUser = (user) => {
    return currentUser && user.user_id === currentUser.user_id;
  };

  const getDisplayRole = (user) => {
    // Display 'Super Admin' only for users with usertype 'SuperAdmin'
    if (user.usertype === 'SuperAdmin') {
      return 'Super Admin';
    }
    return user.usertype;
  };

  const getRoleStyles = (user) => {
    const usertype = user.usertype;
    switch (usertype) {
      case 'buyer':
        return { roleColor: "role-badge-blue", roleTextColor: "role-text-blue" };
      case 'employee':
        return { roleColor: "role-badge-green", roleTextColor: "role-text-green" };
      case 'admin':
        return { roleColor: "role-badge-red", roleTextColor: "role-text-red" };
      case 'SuperAdmin':
        return { roleColor: "role-badge-red", roleTextColor: "role-text-red" };
      default:
        return { roleColor: "role-badge-gray", roleTextColor: "role-text-gray" };
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeFilter === "all") return true;
    if (activeFilter === "customer") return user.usertype === 'buyer';
    if (activeFilter === "employee") return user.usertype === 'employee';
    if (activeFilter === "admin") return user.usertype === 'admin' || user.usertype === 'SuperAdmin';
    return false;
  });

  // apply search (name or email)
  const searchLower = (searchValue || "").trim().toLowerCase();
  const visibleUsers = filteredUsers.filter((user) => {
    if (!searchLower) return true;
    const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const filterButtons = [
    { id: "all", label: `All (${counts.all})`, count: counts.all },
    { id: "customer", label: `Customer (${counts.customer})`, count: counts.customer },
    { id: "employee", label: `Employee (${counts.employee})`, count: counts.employee },
    { id: "admin", label: `Admin (${counts.admin})`, count: counts.admin },
  ];

  const tableHeaders = ["User", "Email", "Role", "Status", "Actions"];

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
                  <div className={`ut-th-text ${header === "Actions" ? "align-center" : ""}`}>{header}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ut-table-body">
            {visibleUsers.map((user) => (
              <div key={`${user.source_table}-${user.user_id}`} className="ut-row">
                <div className="ut-cell user-cell">
                  <div className="user-avatar">{user.firstname.charAt(0)}</div>
                  <div className="user-name">{`${user.firstname} ${user.lastname}`}</div>
                </div>

                <div className="ut-cell">{user.email}</div>

                <div className="ut-cell">
                  <div className="role-wrap">
                    <div className={`role-badge ${getRoleStyles(user).roleColor}`}>
                      <span className={`role-text ${getRoleStyles(user).roleTextColor}`}>{getDisplayRole(user)}</span>
                    </div>
                  </div>
                </div>

                <div className="ut-cell">
                  <button className="status-btn" aria-label={`Status: ${user.status}`}>{user.status}</button>
                </div>

                <div className="ut-cell actions-cell">
                  <div className="actions-group">
                    {!isSuperAdminUser(user) && !isCurrentUser(user) && (
                      <>
                        <button
                          className="action-btn edit"
                          onClick={() => onEdit(user)}
                          aria-label={`Edit ${user.firstname} ${user.lastname}`}
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
                          aria-label={`Delete ${user.firstname} ${user.lastname}`}
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
                      </>
                    )}
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
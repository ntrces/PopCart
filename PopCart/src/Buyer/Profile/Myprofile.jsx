import React, { useState, useEffect } from "react";
import "./Myprofile.css";
import { Link, useNavigate } from "react-router-dom";


export default function Myprofile() {
  const navigate = useNavigate(); // ✅ MUST be at top

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // ✅ FOR ADD ADDRESS MODAL
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    birthday: '',
    email: '',
    contact_number: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    address_label: '',
    postal_code: '1000',
    street_address: '',
    city_municipality: '',
    province: '',
    is_default: false
  });

  // ✅ Sidebar Toggle
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // ✅ Close Profile Button
  const handleClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        try {
          const response = await fetch(`http://localhost/popcart-api/get_user.php?user_id=${userData.user_id}`);
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setFormData({
              lastname: data.user.lastname || '',
              firstname: data.user.firstname || '',
              birthday: data.user.birthday || '',
              email: data.user.email || '',
              contact_number: data.user.contact_number || '09'
            });
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };
    const fetchAddresses = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        try {
          const response = await fetch(`http://localhost/popcart-api/get_addresses.php?user_id=${userData.user_id}`);
          const data = await response.json();
          if (data.success) {
            setAddresses(data.addresses);
          }
        } catch (error) {
          console.error('Error fetching addresses:', error);
        }
      }
    };
    fetchUser();
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contact_number') {
      // Allow only digits
      let filtered = value.replace(/\D/g, '');
      // Ensure starts with 09
      if (!filtered.startsWith('09')) {
        filtered = '09' + filtered.replace(/^09/, '');
      }
      // Limit to 11 digits
      if (filtered.length > 11) {
        filtered = filtered.slice(0, 11);
      }
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost/popcart-api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, ...formData })
      });
      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully');
        // Update localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        alert('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/popcart-api/add_address.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, ...addressForm })
      });
      const data = await response.json();
      if (data.success) {
        alert('Address added successfully');
        setShowModal(false);
        setAddressForm({
          address_label: '',
          postal_code: '1000',
          street_address: '',
          city_municipality: '',
          province: '',
          is_default: false
        });
        // Refresh addresses
        const fetchAddresses = async () => {
          try {
            const response = await fetch(`http://localhost/popcart-api/get_addresses.php?user_id=${user.user_id}`);
            const data = await response.json();
            if (data.success) {
              setAddresses(data.addresses);
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
          }
        };
        fetchAddresses();
      } else {
        alert('Error adding address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch('http://localhost/popcart-api/update_address_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, shipping_address_id: addressId })
      });
      const data = await response.json();
      if (data.success) {
        alert('Address set as default');
        // Refresh addresses
        const fetchAddresses = async () => {
          try {
            const response = await fetch(`http://localhost/popcart-api/get_addresses.php?user_id=${user.user_id}`);
            const data = await response.json();
            if (data.success) {
              setAddresses(data.addresses);
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
          }
        };
        fetchAddresses();
      } else {
        alert('Error setting default address');
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch('http://localhost/popcart-api/delete_address.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.user_id, shipping_address_id: addressId })
        });
        const data = await response.json();
        if (data.success) {
          alert('Address deleted successfully');
          // Refresh addresses
          const fetchAddresses = async () => {
            try {
              const response = await fetch(`http://localhost/popcart-api/get_addresses.php?user_id=${user.user_id}`);
              const data = await response.json();
              if (data.success) {
                setAddresses(data.addresses);
              }
            } catch (error) {
              console.error('Error fetching addresses:', error);
            }
          };
          fetchAddresses();
        } else {
          alert('Error deleting address');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };
  

  return (
    <div className="Cart-wrapper">

      {/* TOP BAR */}
      <div className="top-bar">
  <div className="left-group">
<button className="toggle-btn" onClick={toggleSidebar}>☰</button>
    <div className="logo"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 15V4.16667L17.5 2.5V13.3333" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 17.5C6.38071 17.5 7.5 16.3807 7.5 15C7.5 13.6193 6.38071 12.5 5 12.5C3.61929 12.5 2.5 13.6193 2.5 15C2.5 16.3807 3.61929 17.5 5 17.5Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 15.8333C16.3807 15.8333 17.5 14.7141 17.5 13.3333C17.5 11.9526 16.3807 10.8333 15 10.8333C13.6193 10.8333 12.5 11.9526 12.5 13.3333C12.5 14.7141 13.6193 15.8333 15 15.8333Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 Pop Cart</div>
  </div>

        <div className="right-controls">

          <Link to="/buyer/cart" className="icon-btn">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_42_608)">
                    <path d="M6 16.5C6.41421 16.5 6.75 16.1642 6.75 15.75C6.75 15.3358 6.41421 15 6 15C5.58579 15 5.25 15.3358 5.25 15.75C5.25 16.1642 5.58579 16.5 6 16.5Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.25 16.5C14.6642 16.5 15 16.1642 15 15.75C15 15.3358 14.6642 15 14.25 15C13.8358 15 13.5 15.3358 13.5 15.75C13.5 16.1642 13.8358 16.5 14.25 16.5Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.53748 1.53751H3.03748L5.03248 10.8525C5.10566 11.1937 5.29548 11.4986 5.56926 11.7149C5.84304 11.9312 6.18366 12.0453 6.53248 12.0375H13.8675C14.2089 12.037 14.5398 11.92 14.8057 11.7059C15.0717 11.4918 15.2566 11.1934 15.33 10.86L16.5675 5.28751H3.83998" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_42_608">
                    <rect width="18" height="18" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                    
                             </Link>

         <Link to="/buyer/notifications" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.84534 14C6.96237 14.2027 7.13068 14.371 7.33337 14.488C7.53605 14.605 7.76597 14.6666 8 14.6666C8.23404 14.6666 8.46396 14.605 8.66664 14.488C8.86933 14.371 9.03764 14.2027 9.15467 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.17467 10.2173C2.08758 10.3128 2.0301 10.4315 2.00924 10.559C1.98837 10.6865 2.00501 10.8174 2.05714 10.9356C2.10926 11.0538 2.19462 11.1544 2.30284 11.225C2.41105 11.2956 2.53745 11.3332 2.66667 11.3333H13.3333C13.4625 11.3334 13.589 11.2959 13.6972 11.2254C13.8055 11.1549 13.891 11.0545 13.9433 10.9364C13.9955 10.8182 14.0123 10.6874 13.9916 10.5599C13.9709 10.4323 13.9136 10.3136 13.8267 10.218C12.94 9.30401 12 8.33268 12 5.33334C12 4.27248 11.5786 3.25506 10.8284 2.50492C10.0783 1.75477 9.06087 1.33334 8 1.33334C6.93914 1.33334 5.92172 1.75477 5.17157 2.50492C4.42143 3.25506 4 4.27248 4 5.33334C4 8.33268 3.05933 9.30401 2.17467 10.2173Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
           </Link>

         <Link to="/buyer/profile" className="profile">
                     <div className="avatar">{user?.firstname?.charAt(0).toUpperCase() || 'U'}</div>
                     <p>{user?.firstname || 'User'}</p>
                   </Link>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="home-container">

        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="sidebar">

   <nav className="nav-menu">
    
<Link to="/buyer">
 <button className="nav-item "> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 15.75V9.75C11.25 9.55109 11.171 9.36032 11.0303 9.21967C10.8897 9.07902 10.6989 9 10.5 9H7.5C7.30109 9 7.11032 9.07902 6.96967 9.21967C6.82902 9.36032 6.75 9.55109 6.75 9.75V15.75" stroke="black" stroke-width="1.5"/>
<path d="M2.25 7.49999C2.24995 7.28179 2.2975 7.06621 2.38934 6.86828C2.48118 6.67035 2.6151 6.49484 2.78175 6.35399L8.03175 1.85399C8.30249 1.62517 8.64552 1.49963 9 1.49963C9.35448 1.49963 9.69751 1.62517 9.96825 1.85399L15.2183 6.35399C15.3849 6.49484 15.5188 6.67035 15.6107 6.86828C15.7025 7.06621 15.7501 7.28179 15.75 7.49999V14.25C15.75 14.6478 15.592 15.0293 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0293 2.25 14.6478 2.25 14.25V7.49999Z" stroke="black" stroke-width="1.5"/>
</svg>
Home</button> </Link>

 <Link to="/buyer/marketplace">
<button className="nav-item"> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_41_320)">
<path d="M1.5 5.25L4.8075 1.9425C4.94704 1.80212 5.11299 1.69075 5.29577 1.61481C5.47856 1.53886 5.67457 1.49984 5.8725 1.5H12.1275C12.3254 1.49984 12.5214 1.53886 12.7042 1.61481C12.887 1.69075 13.053 1.80212 13.1925 1.9425L16.5 5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 9V15C3 15.3978 3.15804 15.7794 3.43934 16.0607C3.72064 16.342 4.10218 16.5 4.5 16.5H13.5C13.8978 16.5 14.2794 16.342 14.5607 16.0607C14.842 15.7794 15 15.3978 15 15V9" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.25 16.5V13.5C11.25 13.1022 11.092 12.7206 10.8107 12.4393C10.5294 12.158 10.1478 12 9.75 12H8.25C7.85218 12 7.47064 12.158 7.18934 12.4393C6.90804 12.7206 6.75 13.1022 6.75 13.5V16.5" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.5 5.25H16.5" stroke="#0A0A0A" stroke-width="1.5" strokelinecap="round" strokelinejoin="round"/>
<path d="M16.5 5.25V7.5C16.5 7.89782 16.342 8.27936 16.0607 8.56066C15.7794 8.84196 15.3978 9 15 9C14.5618 8.97588 14.1433 8.81006 13.8075 8.5275C13.718 8.46283 13.6104 8.42802 13.5 8.42802C13.3896 8.42802 13.282 8.46283 13.1925 8.5275C12.8567 8.81006 12.4382 8.97588 12 9C11.5618 8.97588 11.1433 8.81006 10.8075 8.5275C10.718 8.46283 10.6104 8.42802 10.5 8.42802C10.3896 8.42802 10.282 8.46283 10.1925 8.5275C9.8567 8.81006 9.4382 8.97588 9 9C8.5618 8.97588 8.1433 8.81006 7.8075 8.5275C7.71801 8.46283 7.61041 8.42802 7.5 8.42802C7.38959 8.42802 7.28199 8.46283 7.1925 8.5275C6.8567 8.81006 6.4382 8.97588 6 9C5.5618 8.97588 5.1433 8.81006 4.8075 8.5275C4.71801 8.46283 4.61041 8.42802 4.5 8.42802C4.38959 8.42802 4.28199 8.46283 4.1925 8.5275C3.8567 8.81006 3.4382 8.97588 3 9C2.60218 9 2.22064 8.84196 1.93934 8.56066C1.65804 8.27936 1.5 7.89782 1.5 7.5V5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_41_320">
<rect width="18" height="18" fill="white"/>
</clipPath>
</defs>
</svg>
 Marketplace</button> </Link>

              <Link to="/buyer/orders">
               <button className="nav-item"> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 16.2975C8.47803 16.4291 8.7367 16.4985 9 16.4985C9.2633 16.4985 9.52197 16.4291 9.75 16.2975L15 13.2975C15.2278 13.166 15.417 12.9769 15.5487 12.7491C15.6803 12.5214 15.7497 12.263 15.75 12V5.99999C15.7497 5.73694 15.6803 5.4786 15.5487 5.25086C15.417 5.02312 15.2278 4.83401 15 4.70249L9.75 1.70249C9.52197 1.57084 9.2633 1.50153 9 1.50153C8.7367 1.50153 8.47803 1.57084 8.25 1.70249L3 4.70249C2.7722 4.83401 2.58299 5.02312 2.45135 5.25086C2.31971 5.4786 2.25027 5.73694 2.25 5.99999V12C2.25027 12.263 2.31971 12.5214 2.45135 12.7491C2.58299 12.9769 2.7722 13.166 3 13.2975L8.25 16.2975Z" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 16.5V9" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.46753 5.25L9.00003 9L15.5325 5.25" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5.625 3.20251L12.375 7.06501" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
               My Orders</button> </Link>

<button className="sign-out" onClick={() => setShowSignOutModal(true)}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12.75L15.75 9L12 5.25" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.75 9H6.75" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75"
                    stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign Out
              </button>
            </nav>
          </aside>
        )}

        {showSignOutModal && (
  <div className="modal-overlay">
    <div className="signout-modal">
      <h3>Sign Out</h3>
      <p>Are you sure you want to sign out?</p>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={() => setShowSignOutModal(false)}>
          Cancel
        </button>

        <button className="confirm-btn" onClick={() => { localStorage.removeItem('user'); setShowSignOutModal(false); navigate('/'); }}>
          Sign Out
        </button>
      </div>
    </div>
  </div>
  
)}

        {/* MAIN CONTENT */}
        <main className="main-content">
      {/* Header */}
      <div className="profile-header">
        <div>
          <h2>My Profile</h2>
          <p className="subtitle">Manage your account information</p>
        </div>
        <button className="close-btn" onClick={handleClose}>Close</button>

      </div>

      {/* BASIC INFO CARD */}
      <div className="card">
        <h3>Basic Information</h3>
        <p className="card-subtitle">Update your personal details</p>

        <div className="two-grid">
          <div className="input-group">
            <label>Last Name</label>
            <input name="lastname" value={formData.lastname} onChange={handleInputChange} />
          </div>

          <div className="input-group">
            <label>First Name</label>
            <input name="firstname" value={formData.firstname} onChange={handleInputChange} />
          </div>
        </div>

        <div className="input-group">
          <label>Birthday</label>
          <input name="birthday" type="date" value={formData.birthday} onChange={handleInputChange} />
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input disabled value={formData.email} />
          <p className="warning-text">Email cannot be changed</p>
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input name="contact_number" value={formData.contact_number} onChange={handleInputChange} placeholder="09123456789" />
        </div>

        <button className="save-btn" onClick={handleSave}>Save Changes</button>
      </div>

     <div className="card">

  {/* Header */}
  <div className="addresses-header">
    <div>
      <h3 className="address-main-title">Shipping Addresses</h3>
      <p className="card-subtitle">Manage your delivery addresses</p>
    </div>
    <button className="add-btn" onClick={() => setShowModal(true)}> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.3334 6.66666C13.3334 9.99533 9.64075 13.462 8.40075 14.5327C8.28523 14.6195 8.14461 14.6665 8.00008 14.6665C7.85555 14.6665 7.71493 14.6195 7.59941 14.5327C6.35941 13.462 2.66675 9.99533 2.66675 6.66666C2.66675 5.25217 3.22865 3.89562 4.22885 2.89543C5.22904 1.89523 6.58559 1.33333 8.00008 1.33333C9.41457 1.33333 10.7711 1.89523 11.7713 2.89543C12.7715 3.89562 13.3334 5.25217 13.3334 6.66666Z" stroke="#6B7280" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="#6B7280" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 Add Address</button>
  </div>
{showModal && (
  <div className="modal-overlay">
    <div className="modal-box">

      {/* HEADER */}
      <div className="modal-header">
        <div>
          <h2>Shipping Addresses</h2>
          <p>Manage your delivery addresses</p>
        </div>

        <button className="close-btn" onClick={() => setShowModal(false)}>
          ×
        </button>
      </div>

      {/* SECTION LABEL */}
      <div className="new-address">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.6666 8.33335C16.6666 12.4942 12.0508 16.8275 10.5008 18.1659C10.3564 18.2744 10.1806 18.3331 9.99992 18.3331C9.81925 18.3331 9.64348 18.2744 9.49909 18.1659C7.94909 16.8275 3.33325 12.4942 3.33325 8.33335C3.33325 6.56524 4.03563 4.86955 5.28587 3.61931C6.53612 2.36907 8.23181 1.66669 9.99992 1.66669C11.768 1.66669 13.4637 2.36907 14.714 3.61931C15.9642 4.86955 16.6666 6.56524 16.6666 8.33335Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 10.8333C11.3807 10.8333 12.5 9.71402 12.5 8.33331C12.5 6.9526 11.3807 5.83331 10 5.83331C8.61929 5.83331 7.5 6.9526 7.5 8.33331C7.5 9.71402 8.61929 10.8333 10 10.8333Z" stroke="#8B5CF6" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 New Address
      </div>

      {/* FORM */}
      <form className="address-form" onSubmit={handleAddressSubmit}>

        <div className="form-group">
          <label>Address Label *</label>
          <input placeholder="Home, Office, etc." value={addressForm.address_label} onChange={(e) => setAddressForm(prev => ({ ...prev, address_label: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input defaultValue="1000" value={addressForm.postal_code} onChange={(e) => setAddressForm(prev => ({ ...prev, postal_code: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Street Address *</label>
          <input placeholder="House number, street name, barangay" value={addressForm.street_address} onChange={(e) => setAddressForm(prev => ({ ...prev, street_address: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>City/Municipality *</label>
          <input placeholder="Manila, Quezon City, etc." value={addressForm.city_municipality} onChange={(e) => setAddressForm(prev => ({ ...prev, city_municipality: e.target.value }))} />
        </div>

        <div className="form-group">
          <label>Province</label>
          <input placeholder="Metro Manila, Cebu, etc." value={addressForm.province} onChange={(e) => setAddressForm(prev => ({ ...prev, province: e.target.value }))} />
        </div>

        <div className="checkbox-row">
          <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm(prev => ({ ...prev, is_default: e.target.checked }))} />
          <span>Set as default address</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="modal-actions">
          <button type="submit" className="mp-save-btn">
             Add Address
          </button>

          <button
            type="button"
            className="mp-cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}

  {/* Address Items */}
  {addresses.map((address) => (
    <div className="address-card" key={address.shipping_address_id}>
      <div className="address-left">
        <div className="address-icon">
          {address.address_label.charAt(0).toUpperCase()}
        </div>

        <div className="address-info">
          <div className="address-header">
            <div className="address-title">{address.address_label}</div>
            {address.status === 'default' && <span className="default-badge">Default</span>}
          </div>

          <div className="address-text">
            <p className="address-line highlight">{address.street_address}</p>
            <p className="address-line">{address.city_municipality}, {address.province}</p>
            <p className="address-line">{address.postal_code}, Philippines</p>
          </div>
        </div>
      </div>

      <div className="address-actions">
        {address.status !== 'default' && <button className="set-default-btn" onClick={() => handleSetDefault(address.shipping_address_id)}>Set Default</button>}
        {address.status !== 'default' && <button className="delete-btn" onClick={() => handleDeleteAddress(address.shipping_address_id)}>Delete</button>}
      </div>
    </div>
  ))}
</div>

     

        </main>
      </div>
    </div>
  );
}

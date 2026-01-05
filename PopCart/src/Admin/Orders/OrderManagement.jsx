import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.jsx";
import "./Order.css";
import OrderDetails from "./OrderDetails.jsx";
import Header from "../Header/HeaderA.jsx";
import Sidebar from "../Sidebar/SidebarA.jsx";

const statusSequence = ["PENDING", "APPROVED", "PACKING", "SHIPPED", "DELIVERED"];

const statusColors = {
  PENDING: { bg: "#fef9c2", color: "#884a00" },
  APPROVED: { bg: "#ffefdb", color: "#ff6a00" },
  PACKING: { bg: "#e6f0ff", color: "#193bb8" },
  SHIPPED: { bg: "#f2c1fd", color: "#980ffa" },
  DELIVERED: { bg: "#d1fae5", color: "#016630" },
  CANCELLED: { bg: "#ffa1a1", color: "#b91c1c" },
};

const filters = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "packing", label: "Packing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

export const OrderManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost/popcart-api/get_all_orders.php');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "CANCELLED" || currentStatus === "DELIVERED") {
      return null;
    }
    const currentIndex = statusSequence.indexOf(currentStatus);
    return statusSequence[currentIndex + 1];
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch('http://localhost/popcart-api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ order_header_id: orderId, status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const response = await fetch('http://localhost/popcart-api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ order_header_id: orderId, status: 'cancelled' })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const filterCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.order_status.toLowerCase() === "pending").length,
    approved: orders.filter((o) => o.order_status.toLowerCase() === "approved").length,
    packing: orders.filter((o) => o.order_status.toLowerCase() === "packing").length,
    shipped: orders.filter((o) => o.order_status.toLowerCase() === "shipped").length,
    delivered: orders.filter((o) => o.order_status.toLowerCase() === "delivered").length,
    cancelled: orders.filter((o) => o.order_status.toLowerCase() === "cancelled").length,
  };

  const filtersWithCounts = filters.map((filter) => ({
    ...filter,
    count: filterCounts[filter.id],
  }));

  const visibleOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.order_status.toLowerCase() === activeFilter);

  return (
      <div className="admin-layout">
          <Header className="admin-header" />
          <div className="admin-content-wrapper">
    
            <Sidebar className="admin-sidebar" onSignOutClick={() => setShowSignOutModal(true)} />
    
            <main className="admin-main-content">
    <div className="order-page">
      <div className="order-content">
        <header className="order-header">
          <h1 className="order-title">Order Management</h1>
          <p className="order-subtitle">Manage and track customer orders</p>
        </header>

        <nav className="order-filters" role="navigation" aria-label="Order status filters">
          <div className="order-filters-inner">
            {filtersWithCounts.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`filter-btn ${activeFilter === filter.id ? "is-active" : ""}`}
                aria-pressed={activeFilter === filter.id}
                aria-label={`${filter.label} ${filter.count}`}
                type="button"
              >
                <span className="filter-label">
                  {filter.label} ({filter.count})
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="order-list">
          {visibleOrders.map((order) => {
            const nextStatus = getNextStatus(order.order_status);
            const isExpanded = expandedOrderId === order.order_header_id;

            return (
              <article
                key={order.order_header_id}
                className={`order-card ${isExpanded ? "is-expanded" : ""}`}
              >
                {/* Order Header - Always Visible */}
                <div className="order-card-header">
                  <div className="order-card-top">
                    <div className="order-info">
                      <div className="order-top-row">
                        <div className="order-id">Order {order.order_header_id}</div>
                        <div
                          className="order-status-badge"
                          style={{
                            backgroundColor: order.statusBg,
                          }}
                        >
                          <div
                            className="order-status-text"
                            style={{ color: order.statusColor }}
                          >
                            {order.order_status}
                          </div>
                        </div>
                      </div>
                      <div className="order-customer">{order.customer}</div>
                      <time className="order-date">{order.date}</time>
                    </div>

                    <div className="order-right">
                      <div className="order-total-label">Total</div>
                      <div className="order-total-value">{order.total}</div>
                      <button
                        className={`order-expand-btn ${isExpanded ? "is-open" : ""}`}
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order.order_header_id)
                        }
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} order ${order.order_header_id}`}
                        type="button"
                        aria-expanded={isExpanded}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#99A1AF"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="order-card-details">
                    <OrderDetails order={order} />

                    {/* Update Status Section */}
                    {order.order_status !== 'DELIVERED' && (
                    <div className="order-status-update">
                      <div className="order-update-title">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_1_3644)">
                            <path
                              d="M14.5341 6.66666C14.8385 8.16086 14.6215 9.71427 13.9193 11.0679C13.2171 12.4214 12.072 13.4934 10.6751 14.1049C9.27816 14.7164 7.71382 14.8305 6.24293 14.4282C4.77205 14.026 3.48353 13.1316 2.59225 11.8943C1.70097 10.657 1.26081 9.15148 1.34518 7.62892C1.42954 6.10635 2.03332 4.65872 3.05583 3.52744C4.07835 2.39616 5.45779 1.64961 6.96411 1.4123C8.47043 1.17498 10.0126 1.46123 11.3334 2.22333"
                              stroke="#0A0A0A"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 7.33329L8 9.33329L14.6667 2.66663"
                              stroke="#0A0A0A"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1_3644">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <h3>Update Status</h3>
                      </div>

                      <div className="order-status-buttons">
                        {nextStatus ? (
                          <button
                            className="status-btn status-btn-action"
                            onClick={() => handleStatusChange(order.order_header_id, nextStatus)}
                            type="button"
                          >
                            Mark As {nextStatus}
                          </button>
                        ) : null}

                        <button
                          className="status-btn status-btn-cancel"
                          onClick={() => handleCancel(order.order_header_id)}
                          type="button"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
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

                  <button className="confirm-btn" onClick={() => { logout(); setShowSignOutModal(false); navigate('/signin'); }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
  );
};

export default OrderManagement;
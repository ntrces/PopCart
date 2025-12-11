import React, { useState } from "react";
import "./OrderE.css";
import OrderDetails from "./OrderDetails.jsx";
import Header from "../Header/HeaderE.jsx";
import Sidebar from "../Sidebar/SidebarE.jsx";

const initialOrders = [
  {
    id: "ORD006",
    status: "PENDING",
    statusBg: "#fef9c2",
    statusColor: "#884a00",
    customer: "John Customer • customer@demo.com",
    date: "Nov 25, 2025, 07:56 PM",
    total: "₱47.98",
    items: [
      { id: 1, name: "Thriller by Michael Jackson", quantity: 1, price: "$24.99" },
      { id: 2, name: "Hotel California by Eagles", quantity: 1, price: "$22.99" },
    ],
    shippingAddress: "Blk 0 Lot 0 California Heights, California City, USA",
  },
  {
    id: "ORD007",
    status: "DELIVERED",
    statusBg: "#d1fae5",
    statusColor: "#016630",
    customer: "Jane Customer • jane@demo.com",
    date: "Nov 24, 2025, 03:15 PM",
    total: "₱120.00",
    items: [
      { id: 1, name: "Abbey Road by The Beatles", quantity: 2, price: "$29.98" },
    ],
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "ORD008",
    status: "PACKING",
    statusBg: "#e6f0ff",
    statusColor: "#193bb8",
    customer: "Alex Customer • alex@demo.com",
    date: "Nov 23, 2025, 01:20 PM",
    total: "₱89.50",
    items: [
      { id: 1, name: "Dark Side of the Moon by Pink Floyd", quantity: 1, price: "$19.99" },
    ],
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: "ORD009",
    status: "SHIPPED",
    statusBg: "#f2c1fd",
    statusColor: "#980ffa",
    customer: "Sam Customer • sam@demo.com",
    date: "Nov 22, 2025, 11:05 AM",
    total: "₱55.00",
    items: [
      { id: 1, name: "Rumours by Fleetwood Mac", quantity: 1, price: "$24.99" },
    ],
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: "ORD010",
    status: "CANCELLED",
    statusBg: "#ffa1a1",
    statusColor: "#b91c1c",
    customer: "Taylor Customer • taylor@demo.com",
    date: "Nov 21, 2025, 09:40 AM",
    total: "₱0.00",
    items: [
      { id: 1, name: "Legend by Bob Marley", quantity: 1, price: "$18.99" },
    ],
    shippingAddress: "321 Elm St, Houston, TX 77001",
  },
  {
    id: "ORD011",
    status: "APPROVED",
    statusBg: "#ffefdb",
    statusColor: "#ff6a00",
    customer: "Chris Customer • chris@demo.com",
    date: "Nov 20, 2025, 08:22 AM",
    total: "₱200.00",
    items: [
      { id: 1, name: "The Wall by Pink Floyd", quantity: 1, price: "$24.99" },
      { id: 2, name: "Boston by Boston", quantity: 1, price: "$19.99" },
    ],
    shippingAddress: "555 Maple Dr, Phoenix, AZ 85001",
  },
];

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

export const Order = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "CANCELLED" || currentStatus === "DELIVERED") {
      return null;
    }
    const currentIndex = statusSequence.indexOf(currentStatus);
    return statusSequence[currentIndex + 1];
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              statusBg: statusColors[newStatus].bg,
              statusColor: statusColors[newStatus].color,
            }
          : order
      )
    );
  };

  const handleCancel = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "CANCELLED",
              statusBg: statusColors["CANCELLED"].bg,
              statusColor: statusColors["CANCELLED"].color,
            }
          : order
      )
    );
  };

  const filterCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    approved: orders.filter((o) => o.status === "APPROVED").length,
    packing: orders.filter((o) => o.status === "PACKING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const filtersWithCounts = filters.map((filter) => ({
    ...filter,
    count: filterCounts[filter.id],
  }));

  const visibleOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeFilter);

  return (
      <div className="admin-layout">
          <Header className="admin-header" />
          <div className="admin-content-wrapper">
    
            <Sidebar className="admin-sidebar" />
    
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
            const nextStatus = getNextStatus(order.status);
            const isExpanded = expandedOrderId === order.id;

            return (
              <article
                key={order.id}
                className={`order-card ${isExpanded ? "is-expanded" : ""}`}
              >
                {/* Order Header - Always Visible */}
                <div className="order-card-header">
                  <div className="order-card-top">
                    <div className="order-info">
                      <div className="order-top-row">
                        <div className="order-id">{order.id}</div>
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
                            {order.status}
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
                          setExpandedOrderId(isExpanded ? null : order.id)
                        }
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} order ${order.id}`}
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
                            onClick={() => handleStatusChange(order.id, nextStatus)}
                            type="button"
                          >
                            Mark As {nextStatus}
                          </button>
                        ) : null}

                        <button
                          className="status-btn status-btn-cancel"
                          onClick={() => handleCancel(order.id)}
                          type="button"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
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
      </div>
  );
};

export default Order;
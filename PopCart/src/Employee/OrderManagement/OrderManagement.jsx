import React, { useState } from "react";
import "./OrderManagement.css";

const tabs = [
  { label: "All Orders", count: 6 },
  { label: "Pending", count: 2 },
  { label: "Approved", count: 1 },
  { label: "Packing", count: 1 },
  { label: "Shipped", count: 1 },
  { label: "Delivered", count: 1 },
  { label: "Cancelled", count: 0 },
];

const sampleOrders = [
  { status: "PENDING", badge: "pending" },
  { status: "DELIVERED", badge: "delivered" },
  { status: "PACKING", badge: "packing" },
  { status: "SHIPPED", badge: "shipped" },
  { status: "CANCELLED", badge: "cancelled" },
  { status: "APPROVED", badge: "approved" },
];

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All Orders");

  return (
    <div className="om-container">
      <h2 className="om-title">Order Management</h2>
      <p className="om-subtitle">Manage and track customer orders</p>

      <div className="om-search-row">
        <input
          className="om-search"
          placeholder="Search by title or artist..."
        />

        <select className="om-filter">
          <option>All Genres</option>
        </select>
      </div>

      <div className="om-tabs">
        {tabs.map((t) => (
          <button
            key={t.label}
            className={
              activeTab === t.label ? "om-tab-active" : "om-tab"
            }
            onClick={() => setActiveTab(t.label)}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="om-orders">
        {sampleOrders.map((o, i) => (
          <div key={i} className="om-order-card">
            <div>
              <div className="om-order-id">ORD006</div>

              <span className={`om-badge om-${o.badge}`}>
                {o.status}
              </span>

              <div className="om-customer">
                John Customer • customer@demo.com
              </div>

              <div className="om-date">Nov 25, 2025, 07:56 PM</div>
            </div>

            <div className="om-total">
              <div>Total</div>
              <div className="om-amount">₱47.98</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

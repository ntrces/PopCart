import React from "react";
import "./OrderD.css";

const OrderDetails = ({ order }) => {
  return (
    <div className="od-container">
      {/* User and Shipping Section */}
      <div className="od-main-section">
        {/* User Info Column */}
        <div className="od-column">
          <div className="od-header">
            <div className="od-icon" role="img" aria-label="User icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10C5.79086 10 4 11.7909 4 14H12C12 11.7909 10.2091 10 8 10Z"
                  stroke="#0A0A0A"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="od-title">Customer Information</h2>
          </div>
          <div className="od-user-info">
            <p><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p><strong>Contact:</strong> {order.user?.contact || 'N/A'}</p>
          </div>
        </div>

        {/* Items Column */}
        <div className="od-column">
          <div className="od-header">
            <div className="od-icon" role="img" aria-label="Items icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1_3620)">
                  <path
                    d="M7.33333 14.4867C7.53603 14.6037 7.76595 14.6653 8 14.6653C8.23405 14.6653 8.46397 14.6037 8.66667 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.938 11.1301 13.9998 10.9005 14 10.6667V5.33335C13.9998 5.09953 13.938 4.86989 13.821 4.66746C13.704 4.46503 13.5358 4.29692 13.3333 4.18002L8.66667 1.51335C8.46397 1.39633 8.23405 1.33472 8 1.33472C7.76595 1.33472 7.53603 1.39633 7.33333 1.51335L2.66667 4.18002C2.46418 4.29692 2.29599 4.46503 2.17897 4.66746C2.06196 4.86989 2.00024 5.09953 2 5.33335V10.6667C2.00024 10.9005 2.06196 11.1301 2.17897 11.3326C2.29599 11.535 2.46418 11.7031 2.66667 11.82L7.33333 14.4867Z"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 14.6667V8"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.19336 4.66663L8.00003 7.99996L13.8067 4.66663"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 2.84668L11 6.28001"
                    stroke="#0A0A0A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_3620">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="od-title">Items</h2>
          </div>

          <ul className="od-items-list">
            {order.items.map((item) => (
              <li key={item.id} className="od-item">
                <div className="od-item-name">
                  <p className="od-item-text">
                    {item.name} x {item.quantity}
                  </p>
                </div>
                <div className="od-item-price">
                  <div className="od-price-text">{item.price}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping Address Column */}
        <div className="od-column">
          <div className="od-header">
            <h2 className="od-title">Shipping Address</h2>
          </div>
          <address className="od-address">{order.shipping_address}</address>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
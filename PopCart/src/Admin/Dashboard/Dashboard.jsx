import React, { useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";
import Monthly from "./Monthly.jsx";
import Yearly from "./Yearly.jsx";
import Weekly from "./Weekly.jsx";
import Sidebar from "../Sidebar/SidebarA.jsx";
import Header from "../Header/HeaderA.jsx";

export const Dashboard = () => {

  const statsData = [
    {
      title: "Total Users",
      value: "5",
      description: "All registered users",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6666 14V12.6667C10.6666 11.9594 10.3857 11.2811 9.8856 10.781C9.3855 10.281 8.70722 10 7.99998 10H3.99998C3.29274 10 2.61446 10.281 2.11436 10.781C1.61426 11.2811 1.33331 11.9594 1.33331 12.6667V14" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.6667 2.08533C11.2385 2.23358 11.7449 2.56751 12.1065 3.03471C12.468 3.50191 12.6642 4.07593 12.6642 4.66667C12.6642 5.25741 12.468 5.83143 12.1065 6.29863C11.7449 6.76583 11.2385 7.09975 10.6667 7.248" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.6667 14V12.6667C14.6662 12.0758 14.4696 11.5019 14.1076 11.0349C13.7456 10.5679 13.2388 10.2344 12.6667 10.0867" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.99998 7.33333C7.47274 7.33333 8.66665 6.13943 8.66665 4.66667C8.66665 3.19391 7.47274 2 5.99998 2C4.52722 2 3.33331 3.19391 3.33331 4.66667C3.33331 6.13943 4.52722 7.33333 5.99998 7.33333Z" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Total Transactions",
      value: "5",
      description: "Completed users",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.875 3H4.125C3.71079 3 3.375 3.33579 3.375 3.75V15.75C3.375 16.1642 3.71079 16.5 4.125 16.5H13.875C14.2892 16.5 14.625 16.1642 14.625 15.75V3.75C14.625 3.33579 14.2892 3 13.875 3Z" stroke="#717182" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6.75 1.5V3.75M11.25 1.5V3.75M6 7.125H12M6 10.125H10.5M6 13.125H9" stroke="#717182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Total Products",
      value: "5",
      description: "Listed albums",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.33333 14.4867C7.53603 14.6037 7.76595 14.6653 8 14.6653C8.23405 14.6653 8.46397 14.6037 8.66667 14.4867L13.3333 11.82C13.5358 11.7031 13.704 11.535 13.821 11.3326C13.938 11.1301 13.9998 10.9005 14 10.6667V5.33333C13.9998 5.09951 13.938 4.86987 13.821 4.66744C13.704 4.465 13.5358 4.2969 13.3333 4.17999L8.66667 1.51333C8.46397 1.3963 8.23405 1.33469 8 1.33469C7.76595 1.33469 7.53603 1.3963 7.33333 1.51333L2.66667 4.17999C2.46418 4.2969 2.29599 4.465 2.17897 4.66744C2.06196 4.86987 2.00024 5.09951 2 5.33333V10.6667C2.00024 10.9005 2.06196 11.1301 2.17897 11.3326C2.29599 11.535 2.46418 11.7031 2.66667 11.82L7.33333 14.4867Z" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14.6667V8" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.19336 4.66666L8.00003 8L13.8067 4.66666" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 2.84666L11 6.27999" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Total Revenue",
      value: "5",
      description: "All time revenue",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6666 4.66666H14.6666V8.66666" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.6667 4.66666L9.00004 10.3333L5.66671 7L1.33337 11.3333" stroke="#717182" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const orderStatusData = [
    {
      label: "Pending",
      count: "1",
      bgColor: "#A65F00",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0)">
            <path d="M10 5V10L13.3333 11.6667" stroke="#A65F00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 9.99999C18.3334 5.39762 14.6024 1.66666 10 1.66666C5.39765 1.66666 1.66669 5.39762 1.66669 9.99999C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#A65F00" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      label: "Approved",
      count: "1",
      bgColor: "#008236",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.1675 8.33332C18.5481 10.2011 18.2769 12.1428 17.3991 13.8348C16.5213 15.5268 15.0899 16.8667 13.3438 17.6311C11.5976 18.3955 9.64221 18.5381 7.8036 18.0353C5.965 17.5325 4.35435 16.4145 3.24025 14.8678C2.12616 13.3212 1.57596 11.4394 1.68141 9.53615C1.78686 7.63294 2.54159 5.8234 3.81973 4.4093C5.09787 2.9952 6.82217 2.06202 8.70508 1.76537C10.588 1.46872 12.5157 1.82654 14.1667 2.77916" stroke="#008236" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 9.16668L10 11.6667L18.3333 3.33334" stroke="#008236" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Packing",
      count: "1",
      bgColor: "#1447E6",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.16667 18.1083C9.42003 18.2546 9.70744 18.3316 10 18.3316C10.2926 18.3316 10.58 18.2546 10.8333 18.1083L16.6667 14.775C16.9198 14.6289 17.13 14.4187 17.2763 14.1657C17.4225 13.9126 17.4997 13.6256 17.5 13.3333V6.66666C17.4997 6.37439 17.4225 6.08733 17.2763 5.83429C17.13 5.58125 16.9198 5.37113 16.6667 5.22499L10.8333 1.89166C10.58 1.74538 10.2926 1.66837 10 1.66837C9.70744 1.66837 9.42003 1.74538 9.16667 1.89166L3.33333 5.22499C3.08022 5.37113 2.86998 5.58125 2.72372 5.83429C2.57745 6.08733 2.5003 6.37439 2.5 6.66666V13.3333C2.5003 13.6256 2.57745 13.9126 2.72372 14.1657C2.86998 14.4187 3.08022 14.6289 3.33333 14.775L9.16667 18.1083Z" stroke="#1447E6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18.3333V10" stroke="#1447E6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.7417 5.83334L10 10L17.2584 5.83334" stroke="#1447E6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.25 3.55832L13.75 7.84999" stroke="#1447E6" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Shipped",
      count: "1",
      bgColor: "#8200DB",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6666 15V5.00001C11.6666 4.55798 11.491 4.13406 11.1785 3.8215C10.8659 3.50894 10.442 3.33334 9.99996 3.33334H3.33329C2.89127 3.33334 2.46734 3.50894 2.15478 3.8215C1.84222 4.13406 1.66663 4.55798 1.66663 5.00001V14.1667C1.66663 14.3877 1.75442 14.5997 1.9107 14.7559C2.06698 14.9122 2.27895 15 2.49996 15H4.16663" stroke="#8200DB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 15H7.5" stroke="#8200DB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.8333 15H17.5C17.721 15 17.9329 14.9122 18.0892 14.7559C18.2455 14.5996 18.3333 14.3877 18.3333 14.1667V11.125C18.333 10.9359 18.2683 10.7525 18.15 10.605L15.25 6.97999C15.172 6.88239 15.0731 6.80356 14.9606 6.74932C14.8481 6.69509 14.7249 6.66683 14.6 6.66666H11.6666" stroke="#8200DB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.1667 16.6667C15.0871 16.6667 15.8333 15.9205 15.8333 15C15.8333 14.0795 15.0871 13.3333 14.1667 13.3333C13.2462 13.3333 12.5 14.0795 12.5 15C12.5 15.9205 13.2462 16.6667 14.1667 16.6667Z" stroke="#8200DB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.83329 16.6667C6.75377 16.6667 7.49996 15.9205 7.49996 15C7.49996 14.0795 6.75377 13.3333 5.83329 13.3333C4.91282 13.3333 4.16663 14.0795 4.16663 15C4.16663 15.9205 4.91282 16.6667 5.83329 16.6667Z" stroke="#8200DB" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Delivered",
      count: "1",
      bgColor: "#008236",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.1675 8.33332C18.5481 10.2011 18.2769 12.1428 17.3991 13.8348C16.5213 15.5268 15.0899 16.8667 13.3438 17.6311C11.5976 18.3955 9.64221 18.5381 7.8036 18.0353C5.965 17.5325 4.35435 16.4145 3.24025 14.8678C2.12616 13.3212 1.57596 11.4394 1.68141 9.53615C1.78686 7.63294 2.54159 5.8234 3.81973 4.4093C5.09787 2.9952 6.82217 2.06202 8.70508 1.76537C10.588 1.46872 12.5157 1.82654 14.1667 2.77916" stroke="#008236" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 9.16668L10 11.6667L18.3333 3.33334" stroke="#008236" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Cancelled",
      count: "0",
      bgColor: "#C10007",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6024 18.3333 9.99999C18.3333 5.39762 14.6023 1.66666 9.99996 1.66666C5.39759 1.66666 1.66663 5.39762 1.66663 9.99999C1.66663 14.6024 5.39759 18.3333 9.99996 18.3333Z" stroke="#C10007" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.5 7.5L7.5 12.5" stroke="#C10007" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 7.5L12.5 12.5" stroke="#C10007" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const chartData = [
    { name: "Sales", value: 54.06, fill: "#717182" },
    { name: "Revenue", value: 45.94, fill: "#0A0A0A" },
  ];

  const timePeriods = ["Daily", "Weekly", "Monthly", "Yearly"];
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  return (
    <div className="admin-layout">
      <Header className="admin-header" />
      <div className="admin-content-wrapper">

        <Sidebar className="admin-sidebar" />

        <main className="admin-main-content">
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of platform analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">{stat.title}</h3>
              <div className="stat-card-icon">{stat.icon}</div>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-value">{stat.value}</div>
              <p className="stat-card-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status */}
      <div className="order-status-section">
        <div className="order-status-header">
          <h2 className="order-status-title">Order Status Overview</h2>
          <button className="order-status-view-all">View All →</button>
        </div>
        <div className="order-status-grid">
          {orderStatusData.map((status, index) => (
            <div key={index} className="order-status-card">
              <div className="order-status-icon" style={{ backgroundColor: `${status.bgColor}15` }}>
                {status.icon}
              </div>
              <div className="order-status-count">{status.count}</div>
              <div className="order-status-label">{status.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-header">
          <h2 className="chart-title">Analytics</h2>
          <div className="time-period-selector">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`time-period-btn ${selectedPeriod === period ? "active" : ""}`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional charts */}
        <div className="chart-render-area">
          {selectedPeriod === "Daily" && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          {selectedPeriod === "Weekly" && <Weekly />}
          {selectedPeriod === "Monthly" && <Monthly />}
          {selectedPeriod === "Yearly" && <Yearly />}
        </div>
      </div>
    </div>
    </main>
      </div>
    </div>
  );
}

export default Dashboard;
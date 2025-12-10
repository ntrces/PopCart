import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Admin/Header/HeaderA.jsx";
import Sidebar from "../Admin/Sidebar/SidebarA.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Header />
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./Login/LandingPage.jsx";
import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";
import SignInAdmin from './Login/SignInAdmin.jsx';

import Home from "./Buyer/Home/Home.jsx";
import Marketplace from "./Buyer/Marketplace/Marketplace.jsx";
import MyOrder from "./Buyer/MyOrder/MyOrder.jsx";
import MyProfile from "./Buyer/Profile/Myprofile.jsx";
import Cart from "./Buyer/Cart/Cart.jsx";
import BuyerNotification from "./Buyer/Notification/Buyernotif.jsx";

import AdminDashboard from "./Admin/Dashboard/Dashboard.jsx";
import Users from "./Admin/Users/Users.jsx";
import ProductManagement from "./Admin/Products/ProductManagement.jsx";
import OrderManagement from "./Admin/Orders/OrderManagement.jsx";
import AuditLogs from "./Admin/AuditLogs/AuditLogs.jsx";

import OrderManage from "./Employee/OrderManagement/OrderE.jsx";
import ProductManage from "./Employee/ProductManagement/ProductE.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";


export default function App() {
  return (
    
    <Routes>
      {/* Public routes - No authentication required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />
      <Route path="/admin/signin" element={<SignInAdmin />} />

      {/* Protected Admin routes - Requires admin or SuperAdmin role */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "SuperAdmin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin", "SuperAdmin"]}><Users /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["admin", "SuperAdmin"]}><ProductManagement /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin", "SuperAdmin"]}><OrderManagement /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={["admin", "SuperAdmin"]}><AuditLogs /></ProtectedRoute>} />

      {/* Protected Buyer routes - Requires buyer role */}
      <Route path="/buyer" element={<ProtectedRoute allowedRoles={["buyer"]}><Home /></ProtectedRoute>} />
      <Route path="/buyer/marketplace" element={<ProtectedRoute allowedRoles={["buyer"]}><Marketplace /></ProtectedRoute>} />
      <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={["buyer"]}><MyOrder /></ProtectedRoute>} />
      <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={["buyer"]}><MyProfile /></ProtectedRoute>} />
      <Route path="/buyer/cart" element={<ProtectedRoute allowedRoles={["buyer"]}><Cart /></ProtectedRoute>} />
      <Route path="/buyer/notifications" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerNotification /></ProtectedRoute>} />

      {/* Protected Employee routes - Requires employee role */}
      <Route path="/employee" element={<Navigate to="/employee/products" replace />} />
      <Route path="/employee/products" element={<ProtectedRoute allowedRoles={["employee"]}><ProductManage /></ProtectedRoute>} />
      <Route path="/employee/orders" element={<ProtectedRoute allowedRoles={["employee"]}><OrderManage /></ProtectedRoute>} />

      {/* Catch-all: Redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


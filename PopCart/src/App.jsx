// ...existing code...
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";

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

import OrderManage from "./Employee/OrderManagement/OrderE.jsx";
import ProductManage from "./Employee/ProductManagement/ProductE.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/signin"} replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["admin"]}><ProductManagement /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]}><OrderManagement /></ProtectedRoute>} />

      {/* Buyer routes */}
      <Route path="/buyer" element={<ProtectedRoute allowedRoles={["buyer"]}><Home /></ProtectedRoute>} />
      <Route path="/buyer/marketplace" element={<ProtectedRoute allowedRoles={["buyer"]}><Marketplace /></ProtectedRoute>} />
      <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={["buyer"]}><MyOrder /></ProtectedRoute>} />
      <Route path="/buyer/profile" element={<ProtectedRoute allowedRoles={["buyer"]}><MyProfile /></ProtectedRoute>} />
      <Route path="/buyer/cart" element={<ProtectedRoute allowedRoles={["buyer"]}><Cart /></ProtectedRoute>} />
      <Route path="/buyer/notifications" element={<ProtectedRoute allowedRoles={["buyer"]}><BuyerNotification /></ProtectedRoute>} />

      {/* Employee routes */}
      <Route path="/employee" element={<ProtectedRoute allowedRoles={["employee"]}><ProductManage /></ProtectedRoute>} />
      <Route path="/employee/orders" element={<ProtectedRoute allowedRoles={["employee"]}><OrderManage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

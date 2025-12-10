import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

import OrderManage from "./Employee/OrderManagement/OrderManagement.jsx";
import ProductManage from "./Employee/ProductManagement/ProductManagement.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";
import BuyerLayout from "./layouts/BuyerLayout.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/${user.role}` : "/signin"} replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup-buyer" element={<SignUpBuyer />} />

        {/* Admin routes with nested pages rendered into AdminLayout's <Outlet /> */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
        </Route>

        {/* Buyer routes */}
        <Route path="/buyer"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/orders" element={<MyOrder />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/notifications" element={<BuyerNotification />} />
        </Route>

        {/* Employee routes */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProductManage />} />
          <Route path="orders" element={<OrderManage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
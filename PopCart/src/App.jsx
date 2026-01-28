// ...existing code...
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./Login/LandingPage.jsx";
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
import SignInAdmin from './Login/SignInAdmin.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />

      {/* Admin routes */}
      <Route path="/admin/signin" element={<SignInAdmin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/products" element={<ProductManagement />} />
      <Route path="/admin/orders" element={<OrderManagement />} />

      {/* Buyer routes */}
      <Route path="/buyer" element={<Home />} />
      <Route path="/buyer/marketplace" element={<Marketplace />} />
      <Route path="/buyer/orders" element={<MyOrder />} />
      <Route path="/buyer/profile" element={<MyProfile />} />
      <Route path="/buyer/cart" element={<Cart />} />
      <Route path="/buyer/notifications" element={<BuyerNotification />} />

      {/* Employee routes */}
        <Route path="/employee" element={<Navigate to="/employee/products" replace />} />
        <Route path="/employee/products" element={<ProductManage />} />
        <Route path="/employee/orders" element={<OrderManage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


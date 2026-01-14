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

import LandingPage from "./Login/LandingPage.jsx";

export default function App() {
import MyProfile from "./Buyer/Profile/Myprofile.jsx";   // <--- ADDED
import Cart from "./Buyer/Cart/Cart.jsx";             // <--- ADDED
import BuyerNotification from "./Buyer/Notification/Buyernotif.jsx";   // <--- ADDED


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />

      {/* BUYER ROUTES */}
      <Route path="/home" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/myorder" element={<MyOrder />} />
      <Route path="/myprofile" element={<MyProfile />} />   {/* NEW */}
      <Route path="/cart" element={<Cart />} />             {/* NEW */}
      <Route path="/buyernotif" element={<BuyerNotification />} />
    </Routes>
  );
}


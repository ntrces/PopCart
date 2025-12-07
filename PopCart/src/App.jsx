import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";
// BUYER PAGES
import Home from "./Buyer/Home.jsx";
import Marketplace from "./Buyer/Marketplace.jsx";
import MyOrder from "./Buyer/MyOrder.jsx";
import MyProfile from "./Buyer/Myprofile.jsx";   // <--- ADDED
import Cart from "./Buyer/Cart.jsx";             // <--- ADDED
import BuyerNotification from "./Buyer/Buyernotif.jsx";   // <--- ADDED
import OrderManagement from "./Employee/OrderManagement.jsx";      // <--- ADDED
import ProductManagement from "./Employee/ProductManagement.jsx";  // <--- ADDED



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />
      {/* BUYER ROUTES */}
      <Route path="/home" element={<Home />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/myorder" element={<MyOrder />} />
      <Route path="/myprofile" element={<MyProfile />} />   {/* NEW */}
      <Route path="/cart" element={<Cart />} />             {/* NEW */}
      <Route path="/buyernotif" element={<BuyerNotification />} />

   {/* MANAGEMENT ROUTES */}
      <Route path="/ordermanagement" element={<OrderManagement />} />
      <Route path="/productmanagement" element={<ProductManagement />} />
    </Routes>
  );
}

export default App;

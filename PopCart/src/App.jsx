import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";

// BUYER PAGES
import Home from "./Buyer/Home/Home.jsx";
import Marketplace from "./Buyer/Marketplace/Marketplace.jsx";
import MyOrder from "./Buyer/MyOrder/MyOrder.jsx";
import MyProfile from "./Buyer/Profile/Myprofile.jsx";   // <--- ADDED
import Cart from "./Buyer/Cart/Cart.jsx";             // <--- ADDED
import BuyerNotification from "./Buyer/Notification/Buyernotif.jsx";   // <--- ADDED
import OrderManagement from "./Employee/OrderManagement/OrderManagement.jsx";
import ProductManagement from "./Employee/ProductManagement/ProductManagement.jsx";

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
      <Route path="/ordermanagement" element={<OrderManagement />} />
      <Route path='productmanagement' element={<ProductManagement/>}/>
    </Routes>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";
import Home from "./Buyer/Home.jsx"; // <-- ADD THIS
import Marketplace from "./Buyer/Marketplace.jsx"; // <-- ADD THIS
import MyOrder from "./Buyer/MyOrder.jsx"; // <-- ADD THIS


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />
      <Route path="/home" element={<Home />} />        {/* NEW ROUTE */}
      <Route path="/marketplace" element={<Marketplace />} /> {/* MARKETPLACE ROUTE */}
      <Route path="/MyOrder" element={<MyOrder />} />
    </Routes>
  );
}

export default App;


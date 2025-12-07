import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";
import Home from "./Buyer/Home/Home.jsx";
import Marketplace from "./Buyer/Marketplace/Marketplace.jsx";
import MyOrder from "./Buyer/MyOrder/MyOrder.jsx";
import MyProfile from "./Buyer/Profile/Myprofile.jsx";   // <--- ADDED
import Cart from "./Buyer/Cart/Cart.jsx";             // <--- ADDED
import BuyerNotification from "./Buyer/Notification/Buyernotif.jsx"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "./Login/SignIn.jsx";
import SignUpBuyer from "./Login/SignUpBuyer.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup-buyer" element={<SignUpBuyer />} />
    </Routes>
  );
}

export default App;

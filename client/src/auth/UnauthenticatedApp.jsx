import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Login, Register } from "../page/indexPage";

const UnauthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default UnauthenticatedApp;

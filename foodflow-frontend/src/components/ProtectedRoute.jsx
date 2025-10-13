import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Check if user is logged in

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

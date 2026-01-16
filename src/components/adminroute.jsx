
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;


  if (!isAuthenticated || !user || user.role !== "Admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};
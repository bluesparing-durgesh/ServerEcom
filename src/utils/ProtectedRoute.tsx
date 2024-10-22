import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
interface ProtectedRouteProps {
  children: React.ReactNode;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    if (user.role.toLowerCase() === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;

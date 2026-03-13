import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("admin_token");

  // If authenticated → allow access
  return token ? <Outlet /> : <Navigate to="admin/login/" replace />;
};

export default PrivateRoute;

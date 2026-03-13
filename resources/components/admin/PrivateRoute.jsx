import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AdminAuthContext";
const PrivateRoute = () => {
 const { token } = useContext(AuthContext);

  // If authenticated → allow access
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
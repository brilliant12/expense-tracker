import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const PrivateRoute = () => {
 const { token } = useContext(AuthContext);

  // If authenticated → allow access
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;

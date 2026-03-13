import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { userAPI } from "../../api/userAPI";
import toast, { Toaster } from 'react-hot-toast';
const Header = ({ toggleSidebar }) => {
 const handleLogout = async () => {
    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }
      await userAPI.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("user_token");
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
     
      toast.error("Logout failed");
    }
  };

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand navbar-dark top_menu">
      
        
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
              {/* Right profile dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link text-white dropdown-toggle"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaUserCircle size={24} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <Link className="dropdown-item" to="/user/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/user/change-password">
                  Change Password
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item text-danger" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        

      </nav>
    </header>
  );
};

export default Header;

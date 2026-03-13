import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../../api/userAPI";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
const Sidebar = ({ isSidebarOpen }) => {
  const [isExpensesMenuOpen, setIsExpensesMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUriSegment = location.pathname.split("/").pop();
    if (["expenses", "add-expense", "expense-list"].includes(currentUriSegment)) {
      setIsExpensesMenuOpen(true);
    }
    if (["settings"].includes(currentUriSegment)) {
      setIsSettingsMenuOpen(true);
    }
  }, [location.pathname]);

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
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <aside className={`main-sidebar ${isSidebarOpen ? "" : "closed"} sidebar-dark-primary elevation-4`}>
      <div className="sidebar">
        <nav>
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
            {/* Dashboard */}
            <li className="nav-item">
              <NavLink to="/user/dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard (<span>{user.name})</span> </p>
              </NavLink>
            </li>

            {/* Expenses Menu */}
            <li className={`nav-item ${isExpensesMenuOpen ? "menu-open" : ""}`}>
              <button className="nav-link" onClick={() => setIsExpensesMenuOpen(!isExpensesMenuOpen)}>
                <i className="nav-icon fas fa-wallet"></i>
                <p>
                  Expenses
                  <i className="right fas fa-angle-left"></i>
                </p>
              </button>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/user/add-expense" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Add Expense</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/user/expense-list" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Expense List</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Settings Menu */}
            <li className={`nav-item ${isSettingsMenuOpen ? "menu-open" : ""}`}>
              <button className="nav-link" onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}>
                <i className="nav-icon fas fa-cogs"></i>
                <p>
                  Settings
                  <i className="right fas fa-angle-left"></i>
                </p>
              </button>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <NavLink to="/settings/general" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>General Settings</p>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/settings/account" className="nav-link">
                    <i className="far fa-circle nav-icon"></i>
                    <p>Account Settings</p>
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Logout */}
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link">
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Logout</p>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

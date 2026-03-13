import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ onClose }) {
  return (
    <div className="bg-dark text-white p-3 vh-100 sidebar">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Admin Panel</h4>
        {/* Close icon only visible on small screens */}
        <button
          className="btn btn-sm btn-outline-light d-lg-none"
          onClick={onClose}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className="nav-link text-white">
            <i className="fa fa-home me-2"></i> Dashboard
          </NavLink>
        </li>
         <li className="nav-item">
          <NavLink to="/admin/groups_list" className="nav-link text-white">
            <i className="fa fa-layer-group me-2"></i> Groups Master
            
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/users" className="nav-link text-white">
            <i className="fa fa-users me-2"></i> Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/user_group_mapping_store" className="nav-link text-white">
             <i className="fa fa-user-friends me-2"></i>User Group Mapping
          </NavLink>
        </li>
        {/* <li className="nav-item">
          <NavLink to="/admin/reports" className="nav-link text-white">
            <i className="fa fa-file me-2"></i> Reports
          </NavLink>
        </li> */}
        {/* <li className="nav-item">
          <NavLink to="/admin/settings" className="nav-link text-white">
            <i className="fa fa-cog me-2"></i> Settings
          </NavLink>
        </li> */}
      </ul>
    </div>
  );
}

export default Sidebar;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin/SideBar";
import TopNavbar from "../admin/TopNavbar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="d-flex">
            {/* Sidebar wrapper */}
            <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-grow-1 p-3">
                <TopNavbar
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <Outlet />
            </div>

            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-backdrop d-lg-none"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default AdminLayout;

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Auto-collapse only on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Keep sidebar open on desktop when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true); // always open on desktop
      } else {
        setIsSidebarOpen(false); // default closed on mobile
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Content Section */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;

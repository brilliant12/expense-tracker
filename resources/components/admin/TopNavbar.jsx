import React from "react";
import { Navbar, Container, Button,Dropdown } from "react-bootstrap";
import { adminAPI } from "../../api/adminAPI";
import {toast}     from 'react-hot-toast';
function TopNavbar({ onToggleSidebar }) {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }
      await adminAPI.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("admin_token");
      toast.success("Logged out successfully");
      navigate("/admin/login", { replace: true });
    } catch (error) {
     
      toast.error("Logout failed");
    }
  };


  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container fluid>
        {/* Hamburger only visible on small screens */}
        <Button
          variant="outline-secondary"
          className="me-2 d-lg-none"
          onClick={onToggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </Button>

        <Navbar.Brand>Admin Dashboard</Navbar.Brand>

        <div className="d-flex ms-auto">
  {/* Notification button */}
  <Button variant="outline-secondary" className="me-2">
    <i className="fa fa-bell"></i>
  </Button>

  {/* User dropdown menu */}
  <Dropdown align="end">
    <Dropdown.Toggle variant="outline-secondary" id="dropdown-user">
      <i className="fa fa-user"></i>
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item href="/admin/profile">Profile</Dropdown.Item>
      <Dropdown.Item href="/admin/change-password">Change Password</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;

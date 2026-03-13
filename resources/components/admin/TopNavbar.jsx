import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";

function TopNavbar({ onToggleSidebar }) {
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
          <Button variant="outline-secondary" className="me-2">
            <i className="fa fa-bell"></i>
          </Button>
          <Button variant="outline-secondary">
            <i className="fa fa-user"></i>
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;

import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";

function TopNavbar() {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand>Admin Dashboard</Navbar.Brand>
        <div className="d-flex">
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

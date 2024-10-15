import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import { useAuth } from "../hooks/auth";

const Header = () => {
  const { currentUser, userLogout } = useAuth();
  return (
    <Navbar bg="light" expand="lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          EcoNest
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/notes">
              Notes
            </Nav.Link>
            <Nav.Link as={Link} to="/expenses">
              Expenses
            </Nav.Link>
            <Nav.Link as={Link} to="/todos">
              Todos
            </Nav.Link>
            <NavDropdown title="EcoNest" id="basic-nav-dropdown">
              <NavDropdown.Item>{currentUser?.name}</NavDropdown.Item>
              <NavDropdown.Item>{currentUser?.email}</NavDropdown.Item>
              <NavDropdown.Item as="button" onClick={userLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;

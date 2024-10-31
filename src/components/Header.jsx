import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";

import { useAuth } from "../hooks/auth";

const Header = () => {
  const { currentUser, userLogout } = useAuth();
  const navigate = useNavigate();
  return (
    <Navbar bg="transparent" expand="lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          EcoNest
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="align-items-center">
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
            <Dropdown>
              <Dropdown.Toggle variant="transparent" id="dropdown-basic">
                <img
                  className="img-round"
                  src={currentUser?.user?.profileImage || "/assets/dummy.png"}
                  alt="user-img"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/user-profile")}>
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={userLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";

import { useAuth } from "../hooks/auth";

const Header = () => {
  const { currentUser, userLogout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="transparent" expand="lg" expanded={expanded}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={handleNavClick}>
          EcoNest
        </Link>
        <Navbar.Toggle onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse>
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/" onClick={handleNavClick}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/notes" onClick={handleNavClick}>
              Notes
            </Nav.Link>
            <Nav.Link as={Link} to="/expenses" onClick={handleNavClick}>
              Expenses
            </Nav.Link>
            <Nav.Link as={Link} to="/todos" onClick={handleNavClick}>
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
                <Dropdown.Item 
                  onClick={() => {
                    navigate("/user-profile");
                    handleNavClick();
                  }}
                >
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  userLogout();
                  handleNavClick();
                }}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;

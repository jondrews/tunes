import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink } from "react-router-dom";

import "./Navigation.css";

export default function Navigation() {
  return (
    <Navbar fixed="top" bg="dark" variant="dark" expand="md" className="Navigation">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Violin"
            src="/violin.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Tunes!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/tunes" className="nav-link">
              My Tunes
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

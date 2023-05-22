import React from "react"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import { NavLink } from "react-router-dom"

import "./Navigation.css"

export default function Navigation(props) {
  return (
    <Navbar
      fixed="top"
      bg="dark"
      variant="dark"
      expand="md"
      className="Navigation"
    >
      <Container>
        <Navbar.Brand>
          <img
            alt="Violin"
            src="/violin.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <NavLink to="/" className="nav-link d-inline-block">
            Tunes!
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/tunebook" className="nav-link">
              My tunebook
              {/* COUNT BUBBLE DEPRECATED (but could show size of thesession tunebook...) */}
              {/* {props.tuneBook.length > 0 ? (
                <span className="tunebook-count">{props.tuneBook.length}</span>
              ) : (
                ""
              )} */}
            </NavLink>
            <NavLink to="/practice" className="nav-link">
              Practice
            </NavLink>
            <NavLink to="/record" className="nav-link">
              Record
            </NavLink>
            <NavLink to="/prefs" className="nav-link">
              Preferences
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

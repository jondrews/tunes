import { useState } from "react"
import { NavLink } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Offcanvas from "react-bootstrap/Offcanvas"

import TuneNotation from "../TuneNotation/TuneNotation"
import "./TuneBook.css"

export default function TuneBook(props) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const tuneSelection = () => {
    return props.tuneBook.length > 0 ? (
      <div className="tune-selection d-flex flex-column">
        <div className="tune-selection-header">
          <h3>Select a tune:</h3>
        </div>
        {props.tuneBook.map((entry) => (
          <NavLink
            className="tune-item"
            tabIndex="0"
            key={entry.tuneObject.id}
            to={`./${entry.tuneObject.id}`}
          >
            <div className="tune-item-title">{entry.tuneObject.name}</div>
          </NavLink>
        ))}
      </div>
    ) : (
      <div className="tune-selection tune-selection-empty">
        <p>No tunes in tunebook</p>
      </div>
    )
  }

  return (
    <div className="TuneBook">
      <div className="offcanvas-button d-lg-none col-1">
        <Button variant="primary" className="d-lg-none" onClick={handleShow}>
          Tunebook
        </Button>
      </div>

      <div className="score-area d-flex">
        <div className="tune-selection-large d-none d-lg-block">
          {tuneSelection()}
        </div>
        <TuneNotation
          tuneBook={props.tuneBook}
          toggleTuneBookEntry={props.toggleTuneBookEntry}
        />
      </div>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My tunebook</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>{tuneSelection()}</div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

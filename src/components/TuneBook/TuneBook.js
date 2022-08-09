import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Offcanvas from "react-bootstrap/Offcanvas"
import TuneNotation from "../TuneNotation/TuneNotation"

import './TuneBook.css'

export default function TuneBook(props) {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const tuneSelection = () => {
    return(
      <div className="tune-selection">
        {props.tuneBook.map((entry) => (
          <button 
            className="tune-item" 
            tabIndex="0"
            key={entry.tuneObject.id}
            onClick={() => navigate(`./${entry.tuneObject.id}`)}
          >
            {entry.tuneObject.name}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className='TuneBook'>
      <div className="offcanvas-button d-lg-none col-1">
        <Button variant="primary" className="d-lg-none" onClick={handleShow}>
          Tunebook
        </Button>
      </div>

      <div className="score-area d-flex">
        <div className="tune-selection-large d-none d-lg-block">
          { tuneSelection() }
        </div>
        <TuneNotation />
      </div>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Select a tune:</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            { tuneSelection() }
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

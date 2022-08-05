import { useState } from "react"
import Button from "react-bootstrap/Button"
import Offcanvas from "react-bootstrap/Offcanvas"

export default function TuneBook(props) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const tuneSelection = () => {
    return(
      <>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
        <p>Tune name number one.</p>
        <p>Next tune here.</p>
        <p>Then a third tune.</p>
      </>
    )
  }

  return (
    <div className='Tunebook d-flex'>
      <Button variant="primary" className="d-lg-none" onClick={handleShow}>
        Launch
      </Button>

      <div className="d-none d-lg-flex w-25 flex-column bg-light" style={{overflow: 'scroll'}} >
        { tuneSelection() }
      </div>
      <div className="d-flex flex-column flex-grow-1 bg-primary">
        Here's where the score goes.
      </div>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            { tuneSelection() }
            {props.tuneBook.map((bookEntry) => bookEntry.tuneObject.name).join(", ")}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Button from "react-bootstrap/Button"
import Offcanvas from "react-bootstrap/Offcanvas"

import TuneNotation from "../TuneNotation/TuneNotation"
import "./TuneBook.css"

export default function TuneBook(props) {
  const [show, setShow] = useState(false)
  const [thesessionTunebook, setThesessionTunebook] = useState({})

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const thesessionTuneSelection = () => {
    return thesessionTunebook.tunes && thesessionTunebook.tunes.length > 0 ? (
      <div className="tune-selection d-flex flex-column">
        <div className="tune-selection-header">
          <p>{thesessionTunebook.tunes.length} tunes in your thesession.org tunebook:</p>
        </div>
        {thesessionTunebook.tunes.map((entry) => (
          <NavLink
            className="tune-item"
            tabIndex="0"
            key={entry.url}
            to={`./${entry.id}`}
          >
            <div className="tune-item-title">{entry.name}</div>
          </NavLink>
        ))}
      </div>
    ) : (
      <div className="tune-selection tune-selection-empty">
        <p>No tunes in your thesession.org tunebook</p>
      </div>
    )
  }

  const localTuneSelection = () => {
    return props.tuneBook.length > 0 ? (
      <div className="tune-selection d-flex flex-column">
        <div className="tune-selection-header">
          <p>{props.tuneBook.length} tunes in your local tunebook:</p>
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
        <p>No tunes in your local tunebook</p>
      </div>
    )
  }

  useEffect(() => {
    const thesessionTunebookUrl = `https://thesession.org/members/${props.userPrefs.thesessionMemberId}/tunebook?format=json`
    console.log(
      `Looking up thesession.org tunebook for member ${props.userPrefs.thesessionMemberId}`
    )
    fetch(thesessionTunebookUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(
          `--> Found ${data.total} tunes in thesession.org tunebook for member ${props.userPrefs.thesessionMemberId}`
        )
        setThesessionTunebook(data)
      })
      .catch((error) => {
        console.log("error fething thesession.org tunebook:", error)
      })
  }, [props.userPrefs.thesessionMemberId])

  return (
    <div className="TuneBook">
      <div className="offcanvas-button d-lg-none col-1">
        <Button
          variant="primary"
          className="open-tunebook d-lg-none"
          onClick={handleShow}
        >
          <ChevronRightIcon />
          open tunebook
        </Button>
      </div>

      <div className="score-area d-flex">
        <div className="tune-selection-large d-none d-lg-block">
          {thesessionTuneSelection()}
          {localTuneSelection()}
        </div>
        <TuneNotation
          tuneBook={props.tuneBook}
          toggleTuneBookEntry={props.toggleTuneBookEntry}
          resultsList={props.resultsList}
          setResultsList={props.setResultsList}
          filters={props.filters}
          setFilters={props.setFilters}
          userPrefs={props.userPrefs}
          setUserPrefs={props.setUserPrefs}
          practiceDiary={props.practiceDiary}
          setPracticeDiary={props.setPracticeDiary}
          preferredSettings={props.preferredSettings}
          managePreferredSettings={props.managePreferredSettings}
        />
      </div>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My tunebook</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>{thesessionTuneSelection()}</div>
          <div>{localTuneSelection()}</div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

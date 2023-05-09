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
  const [thesessionTunebookLoaded, setThesessionTunebookLoaded] =
    useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const thesessionTuneSelection = () => {
    return props.userPrefs.thesessionMemberId ? (
      thesessionTunebookLoaded ? (
        thesessionTunebook.tunes && thesessionTunebook.tunes.length > 0 ? (
          <div className="tune-selection thesession-tunebook loaded d-flex flex-column">
            <div className="tune-selection-header expandible">
              <h3 className="expandible-header">
                {thesessionTunebook.tunes.length} tunes in your thesession.org
                tunebook:
              </h3>
            </div>
            {thesessionTunebook.tunes.map((entry) => (
              <NavLink
                className="tune-item d-flex"
                tabIndex="0"
                key={entry.url}
                to={`./tune/${entry.id}`}
              >
                {props.practiceDiary.containsTune(entry.id) && (
                  <div className="isInPracticeDiary">&#x2022;</div>
                )}
                <div className="tune-item-title">{entry.name}</div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="tune-selection thesession-tunebook empty">
            <p>No tunes in your thesession.org tunebook</p>
          </div>
        )
      ) : (
        <div className="tune-selection thesession-tunebook loading">
          Loading your tunebook from thesession.org...
        </div>
      )
    ) : (
      <div className="tune-selection thesession-tunebook nomembernumber">
        thesession.org member number not set
      </div>
    )
  }

  // Fetch user's thesession.org tunebook on mount (if thesession.org ID provided)
  useEffect(() => {
    if (props.userPrefs.thesessionMemberId) {
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
          setThesessionTunebookLoaded(true)
        })
        .catch((error) => {
          console.log("error fething thesession.org tunebook:", error)
        })
    }
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
        </div>
        <TuneNotation
          filters={props.filters}
          setFilters={props.setFilters}
          userPrefs={props.userPrefs}
          setUserPrefs={props.setUserPrefs}
          practiceDiary={props.practiceDiary}
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
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

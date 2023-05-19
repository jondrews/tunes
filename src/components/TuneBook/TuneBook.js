import { useState, useEffect } from "react"

import TuneSelection from "./TuneSelection"
import TuneNotation from "../TuneNotation/TuneNotation"
import getMyTunebook from "../../helpers/getMyTunebook"

import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Button from "react-bootstrap/Button"
import Offcanvas from "react-bootstrap/Offcanvas"
import "./TuneBook.css"

export default function TuneBook({
  filters,
  setFilters,
  userPrefs,
  setUserPrefs,
  practiceDiary,
  preferredSettings,
  managePreferredSettings,
}) {
  const [show, setShow] = useState(false)
  const [tunebook, setTunebook] = useState({})
  const [tunebookLoaded, setTunebookLoaded] = useState(false)
  const [selectionList, setSelectionList] = useState([])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // Fetch user's thesession.org tunebook on mount (if thesession.org ID provided)
  useEffect(() => {
    if (userPrefs.thesessionMemberId) {
      getMyTunebook(userPrefs.thesessionMemberId)
        .then((data) => {
          console.log(`Tunebook retrieved:`, data)
          setTunebook(data)
          return data
        })
        .then((_) => {
          setTunebookLoaded(true)
          console.log('Tunebook loaded!')
        })
        .catch((error) => {
          console.log("error fething thesession.org tunebook:", error)
        })
    }
  }, [userPrefs.thesessionMemberId])

  // When loaded, build a list of combined tunes and sets
  useEffect(() => {
    if (tunebookLoaded) {
      console.log('Setting selectionList')

      // TODO: Sort & filter this list

      setSelectionList(tunebook)
    }
  }, [tunebookLoaded])

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
          <TuneSelection
            tunebook={tunebook}
            tunebookLoaded={tunebookLoaded}
            userPrefs={userPrefs}
            practiceDiary={practiceDiary}
            selectionList={selectionList}
          />
        </div>
        <TuneNotation
          filters={filters}
          setFilters={setFilters}
          userPrefs={userPrefs}
          setUserPrefs={setUserPrefs}
          practiceDiary={practiceDiary}
          preferredSettings={preferredSettings}
          managePreferredSettings={managePreferredSettings}
        />
      </div>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My tunebook</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <TuneSelection
              tunebook={tunebook}
              tunebookLoaded={tunebookLoaded}
              userPrefs={userPrefs}
              practiceDiary={practiceDiary}
              selectionList={selectionList}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import abcjs from "abcjs"

import "./TuneResult.css"

export default function TuneResult(props) {
  const [tuneObject, setTuneObject] = useState()
  const navigate = useNavigate()

  const renderNotation = (element, tune) => {
    let incipit = /(^[^|]*[|][^|]*[|][^|]*[|][^|]*[|][^|]*\|)/.exec(tune.abc)[0]
    abcjs.renderAbc(element, `X:1\nK:${tune.key}\n${incipit}\n`, {
      responsive: "resize",
      lineBreaks: [5, 10]
    })
  }

  const filterByTuneType = (tuneType) => {
    props.setFilters((prevFilters) => ({
      ...prevFilters,
      type: `${tuneType}`,
    }))
    props.setResultsList([])
    props.setPage(1)
  }

  const filterByKey = (tuneKey) => {
    let key = /([A-G][b#♭♯]*)/.exec(tuneKey)[0]
    let mode = tuneKey.slice(key.length)
    props.setFilters((prevFilters) => ({
      ...prevFilters,
      mode: {key: key, modeType: mode},
    }))
    props.setResultsList([])
    props.setPage(1)
  }

  const handleClick = (event, callback, arg) => {
    callback(arg)
    // stop the click from propagating to the outer clickable div
    // https://stackoverflow.com/a/2385131/5474303
    if (!event) event = window.event
    event.cancelBubble = true
    if (event.stopPropagation) event.stopPropagation()
  }

  const isInTuneBook = (tuneId) => {
    return props.tuneBook && props.tuneBook.some(
      (bookEntry) => bookEntry.tuneObject.id === tuneId
    )
  }

  useEffect(() => {
    const url = `https://thesession.org/tunes/${props.id}?format=json`

    if (props.id) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTuneObject(data)
          renderNotation(`${props.id}incipit`, data.settings[0])
        })
        .catch((error) => {
          console.log(`.catch method caught an error!:`, error)
        })
    }
  }, [props.id])

  return (
    <div
      className="TuneResult mt-2 d-flex flex-column"
      onClick={() => navigate(`/tune/${props.id}`)}
    >
      <div className="tune-info d-flex">
        {tuneObject ? (
          <div className="tune-title flex-grow-1">
            <h4>{props.title}</h4>
          </div>
        ) : (
          <div className="tune-title flex-grow-1">
            <p>Loading...</p>
          </div>
        )}

        {tuneObject && (
          <div
            className="tune-type"
            onClick={(event) =>
              handleClick(event, filterByTuneType, props.tuneType)
            }
          >
            {props.tuneType}
          </div>
        )}

        {tuneObject && (
          <div
            className="tune-key"
            onClick={(event) =>
              handleClick(event, filterByKey, tuneObject.settings[0].key)
            }
          >
            {tuneObject.settings[0].key}
          </div>
        )}
      </div>

      <div className="tune-incipit" id={props.id + "incipit"}></div>

      {tuneObject && (
        <div className="actions d-flex flex-row-reverse">
          <span
            className="add-to-tunebook btn btn-outline-danger"
            onClick={(event) =>
              handleClick(event, props.toggleTuneBookEntry, {
                tuneObject: tuneObject,
                dateAdded: Date.now(),
              })
            }
          >
            <MenuBookIcon />
            {isInTuneBook(tuneObject.id) ? "Remove" : "Add"}
          </span>
        </div>
      )}
    </div>
  )
}

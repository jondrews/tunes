import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import abcjs from "abcjs"

import "./TuneResult.css"

export default function TuneResult(props) {
  const [tuneObject, setTuneObject] = useState()
  const navigate = useNavigate()

  const renderNotation = (element, tune) => {
    let incipit = /(^[^|]*[|][^|]*[|][^|]*[|][^|]*[|][^|]*\|)/.exec(tune.abc)[0]
    abcjs.renderAbc(element, `X:1\nK:${tune.key}\n${incipit}\n`, {
      responsive: "resize",
      lineBreaks: [5, 10],
      paddingtop: 0,
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
    const key = /([A-G][b#♭♯]*)/.exec(tuneKey)[0]
    const mode = tuneKey.slice(key.length)
    props.setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: key, modeType: mode },
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
    return (
      props.tuneBook &&
      props.tuneBook.some((bookEntry) => bookEntry.tuneObject.id === tuneId)
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
      <div className="tune-info d-flex flex-column">
        {tuneObject ? (
          <>
            <div className="tune-title d-flex">
              <h4 className="p-0 m-0">{props.title}</h4>

              <button
                className="add-to-tunebook"
                onClick={(event) =>
                  handleClick(event, props.toggleTuneBookEntry, {
                    tuneObject: tuneObject,
                    dateAdded: Date.now(),
                  })
                }
              >
                <MenuBookIcon />
                {isInTuneBook(tuneObject.id) ? " Remove" : " Add"}
              </button>
            </div>

            <div className="tune-filters">
              <button
                className="tune-type"
                onClick={(event) =>
                  handleClick(event, filterByTuneType, props.tuneType)
                }
              >
                {props.tuneType.replace(/\b\w/, (c) => c.toUpperCase())}
              </button>

              <span className="tune-in">in</span>

              <button
                className="tune-key"
                onClick={(event) =>
                  handleClick(event, filterByKey, tuneObject.settings[0].key)
                }
              >
                {tuneObject.settings[0].key.replace(
                  /([A-Ga-g][b♭#♯]{0,2})(\s*)([A-Za-z]*)/,
                  "$1 $3"
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="tune-title flex-grow-1">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="tune-incipit" id={props.id + "incipit"}></div>
    </div>
  )
}

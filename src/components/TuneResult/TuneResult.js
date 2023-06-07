import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import abcjs from "abcjs"

import parseABC from "../../helpers/parseABC"
import getTune from "../../helpers/getTune"
import keyModeText from "../../helpers/keyModeText"
import types from "../../types.js"
import "./TuneResult.css"

export default function TuneResult({
  id,
  name,
  filters,
  setFilters,
  resetResults,
  userPrefs,
  tuneCache,
}) {
  const [tune, setTune] = useState()
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()

  const renderNotation = (element, tune, tuneType) => {
    console.log(`tuneResult(${id}) renderNotation() tune object:`, tune)
    const incipit = /^([^|])*\|([^|]*\|){1,4}/.exec(parseABC(tune.abc))[0]
    abcjs.renderAbc(
      element,
      `X:1\nM:${types[tuneType]}\nK:${tune.key}\n${incipit}\n`,
      {
        responsive: "resize",
        lineBreaks: [5, 10],
        paddingtop: 0,
      }
    )
  }

  const filterByTuneType = (tuneType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: `${tuneType}`,
    }))
    resetResults()
  }

  const filterByKey = (tuneKey) => {
    const key = /([A-G][b#♭♯]*)/.exec(tuneKey)[0]
    const mode = tuneKey.slice(key.length)
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: key, modeType: mode },
    }))
    resetResults()
  }

  const handleClick = (event, callback, arg) => {
    callback(arg)
    // stop the click from propagating to the outer clickable div
    // https://stackoverflow.com/a/2385131/5474303
    if (!event) event = window.event
    event.cancelBubble = true
    if (event.stopPropagation) event.stopPropagation()
  }

  useEffect(() => {
    tune && renderNotation(`${id}incipit`, tune.settings[0], tune.type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tune, id])

  useEffect(() => {
    if (id) {
      getTune(id)
        .then((data) => {
          // TODO: Override this if the user has a preffered tune setting in
          // a different key to the primary tune setting.
          // determine if 'showOnlyPrimarySettings' filter is applicable
          if (
            userPrefs.showOnlyPrimarySettings &&
            (filters.mode.key || filters.mode.modeType)
          ) {
            // only display this result if the FIRST setting matches user filters
            if (
              `${data.settings[0].key}` ===
              `${
                filters.mode.key +
                (filters.mode.modeType ? filters.mode.modeType : "major")
              }`
            ) {
              console.log(
                `TUNE ${id}'s primary setting is in ${
                  data.settings[0].key
                } --> (matches ${
                  filters.mode.key +
                  (filters.mode.modeType ? filters.mode.modeType : "major")
                })`
              )
              setTune(data)
            } else {
              console.log(
                `TUNE ${id}'s primary setting is in ${
                  data.settings[0].key
                } --> HIDING (no match: ${
                  filters.mode.key +
                  (filters.mode.modeType ? filters.mode.modeType : "major")
                })`
              )
              setVisible(false)
            }
          } else {
            setTune(data)
          }
        })
    }
  }, [filters, userPrefs, id])

  return (
    visible &&
    tune && (
      <div
        className="TuneResult mt-2 d-flex flex-column"
        onClick={() => navigate(`/tune/${id}`)}
      >
        <div className="tune-info d-flex flex-column">
          {id ? (
            <>
              <div className="tune-title d-flex">
                <h4 className="p-0 m-0">{name}</h4>
              </div>

              <div className="tune-filters">
                <button
                  className="tune-type"
                  onClick={(event) =>
                    handleClick(event, filterByTuneType, tune.type)
                  }
                >
                  {tune.type.replace(/\b\w/, (c) => c.toUpperCase())}
                </button>

                <span className="tune-in">in</span>

                <button
                  className="tune-key"
                  onClick={(event) =>
                    handleClick(event, filterByKey, tune.settings[0].key)
                  }
                >
                  {keyModeText(tune.settings[0].key)}
                </button>

                <span className="tune-id"> #{tune.id}</span>
              </div>
            </>
          ) : (
            <div className="tune-title flex-grow-1">
              <p>Loading...</p>
            </div>
          )}
        </div>

        <div className="tune-incipit" id={id + "incipit"}>
          {/* incipit (snippet of musical notation) gets rendered here */}
        </div>
      </div>
    )
  )
}

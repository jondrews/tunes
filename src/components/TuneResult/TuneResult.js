import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import abcjs from "abcjs"

import parseABC from "../../parseABC"
import "./TuneResult.css"

export default function TuneResult({
  tune,
  tuneBook,
  toggleTuneBookEntry,
  filters,
  setFilters,
  setResultsList,
  setPage,
}) {
  // const [tuneObject, setTuneObject] = useState()
  const navigate = useNavigate()

  const renderNotation = (element, tune) => {
    const incipit = /^([^|])*\|([^|]*\|){1,4}/.exec(parseABC(tune.abc))[0]
    abcjs.renderAbc(element, `X:1\nK:${tune.key}\n${incipit}\n`, {
      responsive: "resize",
      lineBreaks: [5, 10],
      paddingtop: 0,
    })
  }

  const filterByTuneType = (tuneType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: `${tuneType}`,
    }))
    setResultsList([])
    setPage(1)
  }

  const filterByKey = (tuneKey) => {
    const key = /([A-G][b#♭♯]*)/.exec(tuneKey)[0]
    const mode = tuneKey.slice(key.length)
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: key, modeType: mode },
    }))
    setResultsList([])
    setPage(1)
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
      tuneBook &&
      tuneBook.some((bookEntry) => bookEntry.tuneObject.id === tuneId)
    )
  }

  useEffect(() => {
    renderNotation(`${tune.id}incipit`, tune.settings[0])

  }, [tune.id, tune.settings])

  return (
    <div
      className="TuneResult mt-2 d-flex flex-column"
      onClick={() => navigate(`/tune/${tune.id}`)}
    >
      <div className="tune-info d-flex flex-column">
        {tune ? (
          <>
            <div className="tune-title d-flex">
              <h4 className="p-0 m-0">{tune.name}</h4>

              <button
                className="add-to-tunebook"
                onClick={(event) =>
                  handleClick(event, toggleTuneBookEntry, {
                    tuneObject: tune,
                    dateAdded: Date.now(),
                  })
                }
              >
                <MenuBookIcon />
                {isInTuneBook(tune.id) ? " Remove" : " Add"}
              </button>
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
                {tune.settings[0].key.replace(
                  /([A-Ga-g][b♭#♯]{0,2})(\s*)([A-Za-z]*)/,
                  "$1 $3"
                )}
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

      <div className="tune-incipit" id={tune.id + "incipit"}></div>
    </div>
  )
}

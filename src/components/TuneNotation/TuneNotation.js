import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import abcjs from "abcjs"

import "./TuneNotation.css"

export default function TuneNotation(props) {
  const [tuneObject, setTuneObject] = useState()
  const [tuneSetting, setTuneSetting] = useState(0)
  const [dimensions, setDimensions] = useState({
    height: 750,
    width: 750,
  })
  let params = useParams()

  const handleResize = () => {
    setDimensions({
      height: document.getElementById("notation-container")
        ? document.getElementById("notation-container").clientHeight
        : 750,
      width: document.getElementById("notation-container")
        ? document.getElementById("notation-container").clientWidth
        : 750,
    })
  }

  const isInTuneBook = (tuneId) => {
    return (
      props.tuneBook &&
      props.tuneBook.some((bookEntry) => bookEntry.tuneObject.id === tuneId)
    )
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)

    const url = `https://thesession.org/tunes/${params.tuneId}?format=json`
    if (params.tuneId) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log(`Tune ${params.tuneId} data:`, data)
          // 'settings' here refers to the settings (variants) of a folk tune
          setTuneObject(data)
          renderNotation("notation", data, dimensions.width)
        })
        .catch((error) => {
          console.log(`.catch method caught an error!:`, error)
        })
    }

    const renderNotation = (element, tune, windowWidth) => {
      let abc = tune.settings[tuneSetting].abc // TODO: user selects a preferred setting
      abc = abc.replace(/\|!/g, "|") // remove erroneous exclamation marks
      abc = abc.replace(/:\| \|:/g, "::") // remove double barline spaces
      abcjs.renderAbc(
        element,
        `X:1\nT:${tune.name}\nK:${tune.settings[0].key}\n${abc}\n`,
        {
          staffwidth: windowWidth * 0.9,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.6,
            preferredMeasuresPerLine: Math.round(windowWidth / 200),
          },
        }
      )
    }
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [params.tuneId, dimensions.width, tuneSetting])

  // NOTE for parsing time signatures:
  // Barndance, Reel, Hornpipe, Strathspey	4/4
  // Jig	6/8
  // Waltz, Mazurka	3/4
  // Polka	2/4
  // Slide	12/8
  // Slip jig	9/8
  // Three-two	3/2
  // The default note length in each case is 1/8.

  return params.tuneId ? (
    <div className="notation-container" id="notation-container">
      {tuneObject && tuneObject.settings.length > 1 && (
        <div className="settings-select d-flex">
          <p className="settings-select-text">
            Showing #{tuneSetting + 1} out of {tuneObject.settings.length}{" "}
            settings of this tune
          </p>
          <button
            onClick={() =>
              setTuneSetting(
                tuneSetting > 0
                  ? tuneSetting - 1
                  : tuneObject.settings.length - 1
              )
            }
          >
            prev
          </button>
          <button
            onClick={() =>
              setTuneSetting(
                tuneSetting < tuneObject.settings.length - 1
                  ? tuneSetting + 1
                  : 0
              )
            }
          >
            next
          </button>
        </div>
      )}

      <div className="notation" id="notation"></div>

      <div className="actions d-flex">
        {tuneObject && (
          <button
            className="add-to-tunebook btn btn-outline-danger"
            onClick={() => {
              props.toggleTuneBookEntry({
                tuneObject: tuneObject,
                dateAdded: Date.now(),
              })
            }}
          >
            {isInTuneBook(tuneObject.id) ? "Remove" : "Add"}
          </button>
        )}
      </div>
    </div>
  ) : props.tuneBook.length > 0 ? (
    <div className="select-from-tunebook">
      <h2>Select a tune</h2>
      <p>from the tunebook menu on the left</p>
    </div>
  ) : (
    <div className="no-tune-selected">
      <h2>No tune selected</h2>
      <p>
        Head to the <Link to="/">homepage</Link> to find one
      </p>
    </div>
  )
}

import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import abcjs from "abcjs"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import Pluralize from "pluralize"

import parseABC from "../../parseABC"
import "./TuneNotation.css"

export default function TuneNotation({
  tuneBook,
  toggleTuneBookEntry,
  practiceDiary,
  setPracticeDiary,
  preferredSettings,
  setPreferredSettings,
  managePreferredSettings,
}) {
  let params = useParams()
  const [tuneObject, setTuneObject] = useState()
  const [tuneSetting, setTuneSetting] = useState(0)
  const [dimensions, setDimensions] = useState({
    height: 750,
    width: 750,
  })

  const handleResize = () => {
    setDimensions({
      height: document.getElementById("notation")
        ? document.getElementById("notation").clientHeight
        : 750,
      width: document.getElementById("notation")
        ? document.getElementById("notation").clientWidth
        : 750,
    })
  }

  const isInTuneBook = (tuneId) => {
    return (
      tuneBook &&
      tuneBook.some((bookEntry) => bookEntry.tuneObject.id === tuneId)
    )
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()
    const url = `https://thesession.org/tunes/${params.tuneId}?format=json`
    if (params.tuneId) {
      // check if user has a preferred setting for this tune
      setTuneSetting(preferredSettings[params.tuneId] || 0)
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setTuneObject(data)
          console.log(`tuneObject for tune ${params.tuneId}:`, data)
        })
        .catch((error) => console.log(`.catch method caught an error!`, error))
    }
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [params.tuneId, preferredSettings])

  useEffect(() => {
    if (tuneObject) {
      let abc = parseABC(tuneObject.settings[tuneSetting].abc)
      console.log(
        `abc notation for tune ${tuneObject.id} setting ${tuneSetting}:\n`,
        abc
      )
      abcjs.renderAbc(
        "notation",
        `X:1\nT:${tuneObject.name}\nK:${tuneObject.settings[tuneSetting].key}\n${abc}\n`,
        {
          staffwidth: dimensions.width * 0.9,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.6,
            preferredMeasuresPerLine: Math.round(dimensions.width / 200),
          },
        }
      )
    }
  }, [dimensions, tuneSetting, tuneObject])

  return params.tuneId ? (
    <div className="TuneNotation">
      {tuneObject && tuneObject.settings && (
        <div className="settings-select-container">
          <p className="settings-total-text">
            This tune has {tuneObject.settings.length}{" "}
            {Pluralize("setting", tuneObject.settings.length)}
          </p>
          {tuneObject.settings.length > 1 && (
            <div className="settings-select-action">
              <button
                className="settings-select-button"
                onClick={() =>
                  setTuneSetting(
                    tuneSetting > 0
                      ? tuneSetting - 1
                      : tuneObject.settings.length - 1
                  )
                }
              >
                <ChevronLeftIcon />
              </button>
              <p className="settings-select-text">
                Showing setting #{tuneSetting + 1}
              </p>
              <button
                className="settings-select-button"
                onClick={() =>
                  setTuneSetting(
                    tuneSetting < tuneObject.settings.length - 1
                      ? tuneSetting + 1
                      : 0
                  )
                }
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
          <div className="setting-author">
            Setting by:{" "}
            <a
              href={tuneObject.settings[tuneSetting].member.url}
              target="_blank"
              rel="noreferrer"
            >
              {tuneObject.settings[tuneSetting].member.name}
            </a>
          </div>
          {preferredSettings[params.tuneId] === tuneSetting ? (
            <div className="setting-preference">
              <span>This is your preferred setting </span>
              <button
                size="sm"
                className="preferred-setting btn btn-sm btn-outline-secondary"
                onClick={() => {
                  managePreferredSettings("remove", tuneObject.id)
                  setTuneSetting(tuneSetting)
                }}
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="setting-preference">
              <button
                size="sm"
                className="preferred-setting btn btn-sm btn-outline-secondary"
                onClick={() => {
                  managePreferredSettings("set", tuneObject.id, tuneSetting)
                  setTuneSetting(tuneSetting)
                }}
              >
                Set as preferred setting
              </button>
            </div>
          )}
        </div>
      )}

      <div className="notation" id="notation"></div>

      <div className="notation-actions">
        {tuneObject && (
          <button
            className="add-to-tunebook btn btn-outline-danger"
            onClick={() => {
              toggleTuneBookEntry({
                tuneObject: tuneObject,
                dateAdded: Date.now(),
              })
            }}
          >
            <MenuBookIcon />
            {isInTuneBook(tuneObject.id) ? "Remove" : "Add"}
          </button>
        )}
      </div>
    </div>
  ) : tuneBook.length > 0 ? (
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

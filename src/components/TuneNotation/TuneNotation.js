import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import abcjs from "abcjs"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
// import MenuBookIcon from "@mui/icons-material/MenuBook"

import parseABC from "../../parseABC"
import "./TuneNotation.css"

export default function TuneNotation({
  tuneBook,
  toggleTuneBookEntry,
  practiceDiary,
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

  const elem = document.getElementById("notation")
  const openFullscreen = () => {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen()
    }
  }

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
                Setting #{tuneSetting + 1} of {tuneObject.settings.length}
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
              className="thesession-member-link"
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
        {tuneObject &&
          (practiceDiary.containsTune(tuneObject.id) ? (
            <button
              className="practice-now btn btn-outline-danger"
              onClick={() => {
                // TODO: Navigate to Practice page for this tune setting
              }}
            >
              Practice this tune now
            </button>
          ) : (
            <button
              className="add-to-practiceDiary btn btn-outline-danger"
              onClick={() => {
                practiceDiary.add({
                  tunes: [{ tuneId: tuneObject.id, settingId: tuneSetting }],
                })
              }}
            >
              Add to my practice list
            </button>
          ))}
        {tuneObject && (
          <button className="open-fullscreen" onClick={() => openFullscreen()}>
            Fullscreen
          </button>
        )}
      </div>
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

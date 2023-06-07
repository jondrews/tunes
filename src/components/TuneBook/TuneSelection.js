import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

import pluralize from "pluralize"

import getTune from "../../helpers/getTune"
import keyModeText from "../../helpers/keyModeText"

import MusicNoteIcon from "@mui/icons-material/MusicNote"
import QueueMusicIcon from "@mui/icons-material/QueueMusic"
import { grey } from "@mui/material/colors"

import "./TuneSelection.css"

export default function TuneSelection({
  userPrefs,
  practiceDiary,
  tunebookLoaded,
  selectionList,
}) {
  console.log(`TuneSelection received a list of ${selectionList.length} items`)

  const scrollLeft = (width) => {
    return [
      { transform: "translateX(0%)" },
      { transform: `translateX(-${width}px)` },
    ]
  }

  const scrollLeftTiming = {
    duration: 5000,
    easing: "cubic-bezier(.5,.15,0,.7)",
    iterations: Infinity,
  }

  const startScrolling = (event) => {
    const scrollMe = event.target
    if (scrollMe.scrollWidth > scrollMe.parentNode.clientWidth) {
      scrollMe.classList.add("scrolling")
      scrollMe.animate(
        scrollLeft(
          scrollMe.scrollWidth - scrollMe.parentNode.clientWidth * 0.9
        ),
        scrollLeftTiming
      )
    }
  }

  const stopScrolling = (event) => {
    const scrollMe = event.target
    scrollMe.classList.remove("scrolling")
    const animations = scrollMe.getAnimations()
    animations.forEach((a) => {
      a.cancel()
    })
  }

  return userPrefs.thesessionMemberId ? (
    tunebookLoaded ? (
      selectionList.length > 0 ? (
        <div className="list-selection thesession-tunebook loaded d-flex flex-column">
          <div className="list-selection-header expandible">
            <h3 className="expandible-header">
              {selectionList.length} items in your thesession.org tunebook:
            </h3>
          </div>

          {/* List all the tunes in the tunebook */}
          {selectionList.map((listItem) => {
            var itemUrl = ""
            if (listItem.type === "tune") {
              itemUrl = `./tune/${listItem.id}`
            } else if (listItem.type === "set") {
              itemUrl = `./set/${listItem.id}`
            }
            return (
              <NavLink
                className="list-item d-flex"
                tabIndex="0"
                key={listItem.url}
                to={`${itemUrl}`}
              >
                {listItem.type === "tune" &&
                  practiceDiary.containsTune(listItem.id) && (
                    /* Show a symbol if this tune is in the practice diary */
                    <div className="isInPracticeDiary">&#x2022;</div>
                  )}

                {/* 'tune' or 'set' icon */}
                <div className="list-item-icon">
                  {listItem.type === "tune" && (
                    <MusicNoteIcon fontSize="small" sx={{ color: grey[700] }} />
                  )}
                  {listItem.type === "set" && (
                    <QueueMusicIcon
                      fontSize="small"
                      sx={{ color: grey[700] }}
                    />
                  )}
                </div>

                {/* Larger tune/set name title, with sub-title below */}
                <div className="list-item-titles-container d-flex flex-column">
                  {/* Tune/Set name (scrolls when content is too long) */}
                  <div className="list-item-main-title">
                    <div
                      className="list-item-main-title-scrolling"
                      onMouseEnter={(e) => startScrolling(e)}
                      onMouseLeave={(e) => stopScrolling(e)}
                    >
                      {listItem.name}
                    </div>
                  </div>

                  {/* Tune count & tune list, or key/mode/type (scrolls when content is too long) */}
                  <div className="list-item-sub-title">
                    <div
                      className="list-item-sub-title-scrolling"
                      onMouseEnter={(e) => startScrolling(e)}
                      onMouseLeave={(e) => stopScrolling(e)}
                    >
                      {listItem.type === "tune" && (
                        <TuneDetails tuneId={listItem.id} />
                      )}
                      {listItem.type === "set" && 
                        `Set of ${listItem.settings.length} ${pluralize("tunes", listItem.settings.length)}`
                      }
                    </div>
                  </div>
                </div>
              </NavLink>
            )
          })}
        </div>
      ) : (
        <div className="list-selection thesession-tunebook empty">
          No tunes in your thesession.org tunebook
        </div>
      )
    ) : (
      // TODO: Add a loading spinner/animation here
      <div className="list-selection thesession-tunebook loading">
        Loading your tunebook from thesession.org...
      </div>
    )
  ) : (
    <div className="list-selection thesession-tunebook nomembernumber">
      You haven't linked your thesession.org member account. Go to{" "}
      <NavLink className="prefs-link" tabIndex="0" to="/prefs">
        preferences
      </NavLink>{" "}
      to link it.
    </div>
  )
}

// Returns text describing a tune (eg, "Reel in A dorian")
const TuneDetails = ({ tuneId }) => {
  const [tuneDeets, setTuneDeets] = useState(null)

  useEffect(() => {
    getTune(tuneId).then((data) => {
      console.log(`TuneDetails ${tuneId}:`, data)
      setTuneDeets(data)
    })
  }, [tuneId])

  return tuneDeets
    ? `${tuneDeets.type.replace(/^./, (str) =>
        str.toUpperCase()
      )} in ${keyModeText(tuneDeets.settings[0].key)}`
    : "Loading..."
}


// Returns text describing a set (eg, "Set of 3 tunes")
const SetDetails = ({ setId }) => {
  // const [setDeets, setSetDeets] = useState(null)

  // useEffect(() => {
  //   getTune(tuneId).then((data) => {
  //     console.log(`TuneDetails ${tuneId}:`, data)
  //     setTuneDeets(data)
  //   })
  // }, [tuneId])

  // return tuneDeets
  //   ? `${tuneDeets.type.replace(/^./, (str) =>
  //       str.toUpperCase()
  //     )} in ${keyModeText(tuneDeets.settings[0].key)}`
  //   : "Loading..."
}

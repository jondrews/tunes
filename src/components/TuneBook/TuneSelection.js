// import { useState } from "react"
import { NavLink } from "react-router-dom"

import MusicNoteIcon from "@mui/icons-material/MusicNote"
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"
import { grey } from "@mui/material/colors"

import "./TuneSelection.css"

export default function TuneSelection({
  userPrefs,
  practiceDiary,
  tunebook,
  tunebookLoaded,
  selectionList,
}) {
  console.log(`TuneSelection received a list of ${selectionList.length} items`)

  const scrollLeft = (width) => {
    return [
      { transform: "translateX(0%)" },
      // { transform: `translateX(-${width}px)`, offset: 0.5 },
      { transform: `translateX(-${width}px)` },
    ]
  }

  const scrollLeftTiming = {
    duration: 5000,
    easing: "cubic-bezier(.5,0.15,0,.7)",
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
    console.log(`Animations found:`, animations)
    animations.forEach((a) => {
      a.cancel()
    })
  }

  return userPrefs.thesessionMemberId ? (
    tunebookLoaded ? (
      selectionList.length > 0 ? (
        <div className="tune-selection thesession-tunebook loaded d-flex flex-column">
          <div className="tune-selection-header expandible">
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
                className="tune-item d-flex"
                tabIndex="0"
                key={listItem.url}
                to={`${itemUrl}`}
              >
                {/* Show a symbol if this tune is in the practice diary */}
                {/* ########### TODO: Discriminate between tunes and sets here! ############# */}
                {practiceDiary.containsTune(listItem.id) && (
                  <div className="isInPracticeDiary">&#x2022;</div>
                )}
                {/* tune / setlist icon */}
                <div className="tune-item-icon">
                  {listItem.type === "tune" && (
                    <MusicNoteIcon fontSize="small" sx={{ color: grey[700] }} />
                  )}
                  {listItem.type === "set" && (
                    <FormatListNumberedIcon
                      fontSize="small"
                      sx={{ color: grey[700] }}
                    />
                  )}
                </div>
                {/* Tune name */}
                <div className="tune-item-title scrollContainer">
                  <div
                    className="scrollMe"
                    onMouseEnter={(e) => {
                      startScrolling(e)
                    }}
                    onMouseLeave={(e) => {
                      stopScrolling(e)
                    }}
                  >
                    {listItem.name}
                  </div>
                </div>
                {/* TODO: Show incipit, etc */}
              </NavLink>
            )
          })}
        </div>
      ) : (
        <div className="tune-selection thesession-tunebook empty">
          No tunes in your thesession.org tunebook
        </div>
      )
    ) : (
      <div className="tune-selection thesession-tunebook loading">
        Loading your tunebook from thesession.org...
      </div>
    )
  ) : (
    <div className="tune-selection thesession-tunebook nomembernumber">
      You haven't linked your thesession.org member account. Go to{" "}
      <NavLink className="prefs-link" tabIndex="0" to={`/prefs`}>
        preferences
      </NavLink>{" "}
      to link it.
    </div>
  )
}

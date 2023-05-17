// import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

export default function TuneSelection({
  thesessionTunebook,
  thesessionTunebookLoaded,
  userPrefs,
  practiceDiary,
}) {
  return userPrefs.thesessionMemberId ? (
    thesessionTunebookLoaded ? (
      thesessionTunebook.tunes && thesessionTunebook.tunes.length > 0 ? (
        <div className="tune-selection thesession-tunebook loaded d-flex flex-column">
          <div className="tune-selection-header expandible">
            <h3 className="expandible-header">
              {thesessionTunebook.tunes.length} tunes and{" "}
              {thesessionTunebook.sets.length} sets in your thesession.org
              tunebook:
            </h3>
          </div>

          {/* List all the tunes in the tunebook */}
          {thesessionTunebook.tunes.map((entry) => (
            <NavLink
              className="tune-item d-flex"
              tabIndex="0"
              key={entry.url}
              to={`./tune/${entry.id}`}
            >
              {/* Show a symbol if this tune is in the practice diary */}
              {practiceDiary.containsTune(entry.id) && (
                <div className="isInPracticeDiary">&#x2022;</div>
              )}
              {/* Tune name */}
              <div className="tune-item-title">{entry.name}</div>
              {/* TODO: Show incipit, etc */}
            </NavLink>
          ))}
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

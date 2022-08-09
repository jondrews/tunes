import { useEffect } from "react"

import notes from "../../notes.js"
import "./FilterSelect.css"

export default function FilterSelect({ filters, setFilters }) {
  const changeModeFilter = (e) => {
    console.log(`FilterSelect button clicked: ${e.target.value}`)
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: e.target.value, modeType: prevFilters.mode.modeType },
    }))
  }

  return (
    <div className="FilterSelect">
      <div className="note-select-container d-flex">
        {notes.map((note, index) => (
          <div
            className={
              filters.mode.key === note
                ? "note-select-div active-div"
                : "note-select-div"
            }
            key={note + index}
          >
            <input
              type="radio"
              className={
                filters.mode.key === note
                  ? "note-select-button active-button"
                  : "note-select-button"
              }
              id={note}
              name="noteSelect"
              value={note}
              checked={filters.mode.key === note}
              onChange={(e) => changeModeFilter(e)}
            ></input>
            <label
              htmlFor={note}
              className={
                filters.mode.key === note
                  ? "note-select-label active-label"
                  : "note-select-label"
              }
            >
              {note}
            </label>
          </div>
        ))}
        <div
          className={
            filters.mode.key
              ? "note-select-div"
              : "note-select-div active-div" 
          }
          key='anyKey'
        >
          <input
            type="radio"
            className={
              filters.mode.key
                ? "note-select-div"
                : "note-select-div active-div" 
            }
            id='anyKey'
            name="noteSelect"
            value=''
            onChange={(e) => changeModeFilter(e)}
            checked={!filters.mode.key}
          ></input>
          <label
            htmlFor='anyKey'
            className={
              filters.mode.key
                ? "note-select-div"
                : "note-select-div active-div"
            }
          >
            Any key
          </label>
        </div>
      </div>

      {/* TODO: add najor/minor select */}
      {/* TODO: add mode select */}
    </div>
  )
}

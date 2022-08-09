import { useEffect } from "react"

import notes from "../../notes.js"
import "./FilterSelect.css"

export default function FilterSelect({ filters, setFilters }) {
  const changeModeFilter = (e) => {
    console.log(`button clicked: ${e.target.value}`)
    setFilters(prevFilters => ({
      ...prevFilters,
      mode: `${e.target.value}major`
    }))
  }

  useEffect(() => {
    if(document.getElementById(filters.mode[0])) document.getElementById(filters.mode[0]).checked=true
  
  }, )
  
  
  return (
    <div className="FilterSelect">
      <div className="note-select-container d-flex">
        {notes.map((note, index) => (
          <div className="note-select-div" key={note + index}>
            <input
              type="radio"
              className="note-select-button"
              id={note}
              name="noteSelect"
              value={note}
              onChange={(e) => changeModeFilter(e)}
            ></input>
            <label htmlFor={note + index} className="note-select-label">
              {note}
            </label>
          </div>
        ))}
      </div>
      
      {/* TODO: add najor/minor select */}
      {/* TODO: add mode select */}
    </div>
  )
}

import Pluralize from "pluralize"

import notes from "../../notes.js"
import modes from "../../modes.js"
import types from "../../types.js"
import "./FilterSelect.css"

export default function FilterSelect({ filters, setFilters, resetResults }) {
  Pluralize.addPluralRule(/waltz/i, "waltzes") // 🙄

  const changeKey = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { ...prevFilters.mode, key: e.target.value },
    }))
    console.log(
      `KEY FILTER changed to ${e.target.value}. new filters:`,
      filters
    )
    resetResults()
  }

  const changeMode = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: prevFilters.mode.key, modeType: e.target.value },
    }))
    resetResults()
  }

  const changeType = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      type: e.target.value,
    }))
    resetResults()
  }

  return (
    <div className="FilterSelect">
      <div className="tune-type-select-container">
        <p className="tune-type-select-text">Show me</p>
        <select
          name="type-select"
          id="type-select"
          value={filters.type || ""}
          onChange={(e) => changeType(e)}
        >
          <option value="">all tunes</option>
          {Object.keys(types).map((type) => (
            <option value={type} key={type}>
              {Pluralize(type, 2)}
            </option>
          ))}
        </select>
      </div>

      <div className="note-select-container">
        <p className="note-select-text">in the key of:</p>
        {notes.map((note, index) => (
          <div
            className={
              filters.mode.key === note
                ? note.length === 1
                  ? "note-select-div white-note active-div " + note
                  : "note-select-div black-note active-div " + note
                : note.length === 1
                ? "note-select-div white-note " + note
                : "note-select-div black-note " + note
            }
            key={note + index}
          >
            <input
              type="radio"
              className={
                filters.mode.key === note
                  ? note.length === 1
                    ? "note-select-button white-note-button active-button"
                    : "note-select-button black-note-button active-button"
                  : note.length === 1
                  ? "note-select-button white-note-button"
                  : "note-select-button black-note-button"
              }
              id={note}
              name="noteSelect"
              value={note}
              checked={filters.mode.key === note}
              onChange={(e) => changeKey(e)}
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
      </div>

      <div className="mode-select-container">
        <div
          className={filters.mode.key ? "anyKey-div" : "anyKey-div active-div"}
          key="anyKey"
        >
          <input
            type="radio"
            className={
              filters.mode.key ? "anyKey-button" : "anyKey-button active-button"
            }
            id="anyKey"
            name="noteSelect"
            value=""
            onChange={(e) => changeKey(e)}
            checked={!filters.mode.key}
          ></input>
          <label
            htmlFor="anyKey"
            className={
              filters.mode.key ? "anyKey-label" : "anyKey-label active-label"
            }
          >
            any key
          </label>
        </div>

        <select
          name="mode-select"
          id="mode-select"
          value={filters.mode.key ? filters.mode.modeType || "major" : ""}
          disabled={!filters.mode.key}
          onChange={(e) => changeMode(e)}
        >
          <option value="">any mode</option>
          <option value="major">major</option>
          <option value="minor">minor</option>
          {modes.map((mode) => (
            <option value={mode} key={mode + "-mode"}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

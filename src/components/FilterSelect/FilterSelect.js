import notes from "../../notes.js"
import modes from "../../modes.js"
import "./FilterSelect.css"

export default function FilterSelect({ filters, setFilters }) {
  const changeKey = (e) => {
    console.log(`FilterSelect key button clicked: ${e.target.value}`)
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: e.target.value, modeType: prevFilters.mode.modeType },
    }))
  }
  
  const changeMode = (e) => {
    console.log(`FilterSelect mode selected: ${e.target.value}`)
    setFilters((prevFilters) => ({
      ...prevFilters,
      mode: { key: prevFilters.mode.key, modeType: e.target.value },
    }))
  }

  return (
    <div className="FilterSelect d-flex">
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
        <div
          className={
            filters.mode.key ? "note-select-div" : "note-select-div active-div"
          }
          key="anyKey"
        >
          <input
            type="radio"
            className={
              filters.mode.key
                ? "note-select-div"
                : "note-select-div active-div"
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
              filters.mode.key
                ? "note-select-div"
                : "note-select-div active-div"
            }
          >
            Any key
          </label>
        </div>
      </div>

      <div className="mode-select-container">
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

      {/* TODO: add major/minor select */}
      {/* TODO: add mode select */}
      {/* TODO: add tune type select */}
    </div>
  )
}

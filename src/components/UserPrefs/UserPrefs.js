import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import getTune from "../../helpers/getTune"
import "./UserPrefs.css"

export default function UserPrefs({
  resultsList,
  setResultsList,
  filters,
  setFilters,
  userPrefs,
  setUserPrefs,
  practiceDiary,
  setPracticeDiary,
  preferredSettings,
  managePreferredSettings,
}) {
  const updateUserPref = (key, value) => {
    // Update userPrefs state
    setUserPrefs((prevPrefs) => ({ ...prevPrefs, [key]: value }))
    // Save userPrefs to localStorage
    localStorage.setItem("userPrefs", JSON.stringify(userPrefs))
  }

  const handleInputChange = (key, event) => {
    let value = event.target.value
    if (typeof userPrefs[key] === "boolean") {
      value = event.target.checked
    } else if (typeof userPrefs[key] === "number") {
      value = Number(value)
    }
    updateUserPref(key, value)
  }

  return (
    <div className="UserPrefs">
      <div className="app-prefs">
        <h3>App preferences:</h3>
        <form className="app-prefs-list d-flex flex-column">
          {Object.entries(userPrefs).map(([appFeature, userPref]) => (
            <AppFeaturePref
              key={appFeature}
              appFeature={appFeature}
              userPref={userPref}
              setUserPrefs={setUserPrefs}
              handleInputChange={handleInputChange}
            />
          ))}
        </form>
      </div>

      <div className="preferred-settings">
        <h3>My preferred tune settings:</h3>
        <ul>
          {/* List of preferred tune settings, if any exist */}
          {Object.entries(preferredSettings).length > 0 &&
            Object.entries(preferredSettings).map(([tuneId, settingId]) => (
              <PreferredTuneSetting
                key={`${tuneId}+${settingId}`}
                tuneId={tuneId}
                settingId={settingId}
                managePreferredSettings={managePreferredSettings}
              />
            ))}

          {/* User has no preferred tune settings */}
          {Object.entries(preferredSettings).length === 0 && (
            <li className="settings-list loaded empty">
              No preferred tune settings, yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

function PreferredTuneSetting({ tuneId, settingId, managePreferredSettings }) {
  const [loaded, setLoaded] = useState(false)
  const [tuneObject, setTuneObject] = useState({})

  const handleClick = (event, callback, ...args) => {
    callback(...args)
    // Prevent click propagating up the DOM to parent(s)
    // https://stackoverflow.com/a/2385131/5474303
    if (!event) event = window.event
    event.cancelBubble = true
    if (event.stopPropagation) event.stopPropagation()
  }

  useEffect(() => {
    setLoaded(false)
    getTune(tuneId)
      .then((data) => {
        setTuneObject(data)
      })
      .then(() => {
        setLoaded(true)
      })
      .catch((error) =>
        console.log(`Error in UserPrefs API call cycle:`, error)
      )
  }, [tuneId, settingId])

  return loaded ? (
    <li className="settings-list loaded">
      <Link className="tune-name" to={`/tune/${tuneId}`}>
        {tuneObject.name}
      </Link>
      <span className="tune-type"> {tuneObject.type}</span>
      <span className="tuneId"> (#{tuneId})</span>: Setting #{settingId + 1} in{" "}
      {/([A-G][b#♭♯]*)/.exec(tuneObject.settings[settingId].key)[0]}{" "}
      {tuneObject.settings[settingId].key.slice(
        /([A-G][b#♭♯]*)/.exec(tuneObject.settings[settingId].key)[0].length
      )}
      , by{" "}
      <a
        href={tuneObject.settings[settingId].member.url}
        target="_blank"
        rel="noreferrer"
        className="thesession-member-link"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        {tuneObject.settings[settingId].member.name}
      </a>
      <button
        className="remove-tune-setting"
        onClick={(event) => {
          handleClick(event, managePreferredSettings, "remove", tuneId)
        }}
      ></button>
    </li>
  ) : (
    <li key={`${tuneId}+${settingId}`} className="settings-list loading">
      Loading...
    </li>
  )
}

function AppFeaturePref({
  appFeature,
  userPref,
  setUserPrefs,
  handleInputChange,
}) {
  return (
    <li className="app-prefs-list-item container-md d-flex flex-row mb-1 p-0 border">
      <div className="app-feature feature-name align-self-center flex-grow-1 border border-secondary d-flex flex-column">
        <label htmlFor={appFeature} className="m-0 p-0">
          {appFeature}
        </label>
        {/* <p className="m-0 p-0">
          Explanatory text here. All about this feature and why you should
          activate it, or not.
        </p> */}
      </div>
      <div className="app-feature form-element align-self-center flex-shrink-0 border border-secondary">
        {typeof userPref === "boolean" ? (
          <input
            type="checkbox"
            id={appFeature}
            checked={userPref}
            onChange={(event) => handleInputChange(appFeature, event)}
          />
        ) : typeof value === "number" ? (
          <input
            type="number"
            id={appFeature}
            value={userPref}
            onChange={(event) => handleInputChange(appFeature, event)}
          />
        ) : (
          <input
            type="text"
            id={appFeature}
            value={userPref}
            onChange={(event) => handleInputChange(appFeature, event)}
          />
        )}
      </div>
    </li>
  )
}

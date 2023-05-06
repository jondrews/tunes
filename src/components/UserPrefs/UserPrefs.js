import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
            />
          ))}
        </form>
      </div>

      <div className="preferred-settings">
        <h3>My preferred tune settings:</h3>
        <ul>
          {Object.entries(preferredSettings).map(([tuneId, settingId]) => (
            <PreferredTuneSetting
              key={`${tuneId}+${settingId}`}
              tuneId={tuneId}
              settingId={settingId}
              managePreferredSettings={managePreferredSettings}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

function PreferredTuneSetting({ tuneId, settingId, managePreferredSettings }) {
  const [loaded, setLoaded] = useState(false)
  const [tuneObject, setTuneObject] = useState({})
  const navigate = useNavigate()

  const handleClick = (event, callback, ...args) => {
    callback(...args)
    // stop the click from propagating up the DOM to parent(s)
    // https://stackoverflow.com/a/2385131/5474303
    if (!event) event = window.event
    event.cancelBubble = true
    if (event.stopPropagation) event.stopPropagation()
  }

  useEffect(() => {
    setLoaded(false)
    const url = `https://thesession.org/tunes/${tuneId}?format=json`
    fetch(url)
      .then((response) => response.json())
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
    <li
      className="settings-list loaded"
      onClick={() => navigate(`/tune/${tuneId}`)}
    >
      <h3 className="tune-name">{tuneObject.name}</h3>
      <span className="tuneId">(#{tuneId})</span>: Setting #{settingId + 1} in{" "}
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

function AppFeaturePref({ appFeature, userPref, setUserPrefs }) {
  const formElement = () => {
    switch (typeof userPref) {
      case "boolean":
        return "boolean switch"
      case "number":
        return "number box"
      case "string":
        return "text box"
      default:
        return "unsupported type"
    }
  }

  return (
    <li className="app-prefs-list-item container-md d-flex flex-row mb-1 p-0 border">
      <div className="app-feature feature-name align-self-center flex-grow-1 border border-secondary d-flex flex-column">
        <h6 className="m-0 p-0">
          {appFeature}: {userPref}
        </h6>
        <p className="m-0 p-0">
          Explanatory text here. All about this feature and why you should
          activate it, or not. Yadda yadda, kjhg kjhgf jhgf ytf jfd jhgfjk jyg
          jyug kjy kjhgb kjuygb kjyg kjyg kygk , uif fbuybk uyg kuyfkb ufb kub
          jytv hgrdhdvrytvtrdes jh yt yt ytfjhgfjhgfjhytjytrjhgnhgfjhgtffk jf
          kufb uytfb uytfb u!
        </p>
      </div>
      <div className="app-feature form-element align-self-center flex-shrink-0 border border-secondary">
        {formElement()}
      </div>
    </li>
  )
}

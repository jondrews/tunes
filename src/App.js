import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"

import HomePage from "./components/HomePage/HomePage"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import TuneNotation from "./components/TuneNotation/TuneNotation"
import TuneBook from "./components/TuneBook/TuneBook"
import Navigation from "./components/Navigation/Navigation"
import Practice from "./components/Practice/Practice"
import UserPrefs from "./components/UserPrefs/UserPrefs"
import "./App.css"

const App = () => {
  const [resultsList, setResultsList] = useState([]) // array of Objects
  const [tuneBook, setTuneBook] = useState([]) // array of Objects
  const [practiceDiary, setPracticeDiary] = useState([]) // array of Objects
  const [preferredSettings, setPreferredSettings] = useState({}) // {tuneID: setting} pairs (setting is zero-indexed)
  const [prefSettingsLoaded, setPrefSettingsLoaded] = useState(false) // prevents saving a blank object as preferredSettings before the useEffect() hook loads it for the first time
  const [filters, setFilters] = useState({
    type: "",
    mode: { key: "", modeType: "" },
    q: "",
    inTuneBook: false,
    showTransposedTunes: false,
  })
  const [userPrefs, setUserPrefs] = useState({
    thesessionMemberId: 151540,
    showOnlyPrimarySettings: true, // only return a tune result if its FIRST setting matches the filters (otherwise return the tune result if ANY setting matches filters)
  })

  const isInTuneBook = (lookFor) => {
    return tuneBook.some(
      (bookEntry) => bookEntry.tuneObject.id === lookFor.tuneObject.id
    )
  }

  const toggleTuneBookEntry = (bookEntry) => {
    if (isInTuneBook(bookEntry)) {
      const newTuneBook = tuneBook.filter(
        (entry) => entry.tuneObject.id !== bookEntry.tuneObject.id
      )
      setTuneBook(newTuneBook)
    } else {
      const newEntry = {
        tuneObject: resultsList.filter(
          (tune) => tune.id === bookEntry.tuneObject.id
        )[0],
        dateAdded: bookEntry.dateAdded,
      }
      const newTuneBook = [newEntry, ...tuneBook]
      setTuneBook(newTuneBook)
    }
  }

  const managePreferredSettings = (action, tuneId, settingId = -1) => {
    if (action === "set" && settingId >= 0) {
      const newSettings = { ...preferredSettings, [tuneId]: settingId }
      setPreferredSettings(newSettings)
    }
    if (action === "remove") {
      const newSettings = { ...preferredSettings }
      delete newSettings[tuneId]
      setPreferredSettings(newSettings)
    }
  }

  useEffect(() => {
    console.log('Loading preferredSettings from localStorage')
    const savedPreferredSettings = JSON.parse(
      localStorage.getItem("preferredSettings")
    )
    if (savedPreferredSettings) {
      console.log('Loaded preferredSettings:', savedPreferredSettings)
      setPreferredSettings(savedPreferredSettings)
    } else {
      console.log('No saved preferredSettings found')
    }
    setPrefSettingsLoaded(true)
  }, [])

  useEffect(() => {
    if (prefSettingsLoaded) {
      console.log('Saving preferredSettings as:', preferredSettings)
      localStorage.setItem("preferredSettings", JSON.stringify(preferredSettings))
    }
  }, [preferredSettings, prefSettingsLoaded])

  return (
    <div className="App" data-testid="App">
      <BrowserRouter>
        <Navigation
          tuneBook={tuneBook}
          toggleTuneBookEntry={toggleTuneBookEntry}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
                resultsList={resultsList}
                setResultsList={setResultsList}
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                setPracticeDiary={setPracticeDiary}
                preferredSettings={preferredSettings}
                managePreferredSettings={managePreferredSettings}
              />
            }
          />

          <Route
            path="/tune"
            element={
              <TuneNotation
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
                resultsList={resultsList}
                setResultsList={setResultsList}
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                setPracticeDiary={setPracticeDiary}
                preferredSettings={preferredSettings}
                managePreferredSettings={managePreferredSettings}
              />
            }
          >
            <Route
              path=":tuneId"
              element={
                <TuneNotation
                  tuneBook={tuneBook}
                  toggleTuneBookEntry={toggleTuneBookEntry}
                  resultsList={resultsList}
                  setResultsList={setResultsList}
                  filters={filters}
                  setFilters={setFilters}
                  userPrefs={userPrefs}
                  setUserPrefs={setUserPrefs}
                  practiceDiary={practiceDiary}
                  setPracticeDiary={setPracticeDiary}
                  preferredSettings={preferredSettings}
                  managePreferredSettings={managePreferredSettings}
                />
              }
            />
          </Route>

          <Route
            path="/tunebook"
            element={
              <TuneBook
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
                resultsList={resultsList}
                setResultsList={setResultsList}
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                setPracticeDiary={setPracticeDiary}
                preferredSettings={preferredSettings}
                managePreferredSettings={managePreferredSettings}
              />
            }
          >
            <Route
              path=":tuneId"
              element={
                <TuneNotation
                  tuneBook={tuneBook}
                  toggleTuneBookEntry={toggleTuneBookEntry}
                  resultsList={resultsList}
                  setResultsList={setResultsList}
                  filters={filters}
                  setFilters={setFilters}
                  userPrefs={userPrefs}
                  setUserPrefs={setUserPrefs}
                  practiceDiary={practiceDiary}
                  setPracticeDiary={setPracticeDiary}
                  preferredSettings={preferredSettings}
                  managePreferredSettings={managePreferredSettings}
                />
              }
            />
          </Route>

          <Route
            path="/practice"
            element={
              <Practice
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
                resultsList={resultsList}
                setResultsList={setResultsList}
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                setPracticeDiary={setPracticeDiary}
                preferredSettings={preferredSettings}
                managePreferredSettings={managePreferredSettings}
              />
            }
          />

          <Route
            path="/prefs"
            element={
              <UserPrefs
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
                resultsList={resultsList}
                setResultsList={setResultsList}
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                setPracticeDiary={setPracticeDiary}
                preferredSettings={preferredSettings}
                managePreferredSettings={managePreferredSettings}
              />
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App

import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { DateTime } from "luxon"

import HomePage from "./components/HomePage/HomePage"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import TuneNotation from "./components/TuneNotation/TuneNotation"
import TuneBook from "./components/TuneBook/TuneBook"
import Navigation from "./components/Navigation/Navigation"
import Practice from "./components/Practice/Practice"
import Record from "./components/Record/Record"
import UserPrefs from "./components/UserPrefs/UserPrefs"
import "./App.css"

const App = () => {
  const [practiceDiaryEntries, setPracticeDiaryEntries] = useState([]) // array of Objects
  const [practiceDiaryLoaded, setPracticeDiaryLoaded] = useState(false)
  const [preferredTuneSettings, setPreferredTuneSettings] = useState({}) // {tuneID: setting} pairs (setting is zero-indexed)
  const [prefTuneSettingsLoaded, setPrefTuneSettingsLoaded] = useState(false) // prevents saving a blank object as preferredSettings before the useEffect() hook loads it for the first time
  const [recordings, setRecordings] = useState([])
  const [userPrefs, setUserPrefs] = useState({})
  const [userPrefsLoaded, setUserPrefsLoaded] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    mode: { key: "", modeType: "" },
    q: "",
    inTuneBook: false,
    showTransposedTunes: false,
  })

  const defaultUserPrefs = {
    thesessionMemberId: 0,
    showOnlyPrimarySettings: true, // only return a tune result if its FIRST setting matches the filters (otherwise return the tune result if ANY setting matches filters)
    mostRecentInstrument: "defaultstrument",
    customInstrumentsList: [],
    recordingsDirectory: "/recordings",
  }

  const practiceDiaryContainsTune = (findThisTuneId) => {
    return practiceDiaryEntries.some((practiceSession) =>
      practiceSession.tunes.some((tune) => tune.tuneId === findThisTuneId)
    )
  }

  const practiceDiaryContainsSetting = (findThisSettingId) => {
    return practiceDiaryEntries.some((practiceSession) =>
      practiceSession.tunes.some((tune) => tune.settingId === findThisSettingId)
    )
  }

  const tuneHasBeenPracticed = (tuneId) => {
    return practiceDiaryEntries.some(
      (practiceSession) =>
        practiceSession.tunes.some((tune) => tune.tuneId === tuneId) &&
        practiceSession.instrument
    )
  }

  const getPracticeWishList = () => {
    /* A tune or set isn't considered 'practiced' until it is assigned an
       instrument. This method returns practiceSession objects for
       tunes and sets that aren't yet practiced.                            */
    const tunes = []
    const sets = []
    practiceDiaryEntries.forEach((practiceSession) => {
      if (!practiceSession.instrument) {
        if (practiceSession.tunes.length === 1) {
          tunes.push(practiceSession)
        } else if (practiceSession.tunes.length > 1 && practiceSession.setId) {
          sets.push(practiceSession)
        }
      }
    })
    return { tunes, sets }
  }

  const addToPracticeDiary = (newPracticeSession) => {
    if (typeof newPracticeSession === "object") {
      console.group("Adding a new practice session to practiceDiary")
      newPracticeSession.date = DateTime.now()
      console.log("newPracticeSession =", newPracticeSession)
      setPracticeDiaryEntries([newPracticeSession, ...practiceDiaryEntries])
      console.groupEnd("Done!")
      return newPracticeSession
    } else {
      console.log(
        `TYPE ERROR adding newPracticeSession to practiceDiary. Expected 'object', but got ${typeof newPracticeSession}.`
      )
      return false
    }
  }

  // Package together practiceDiary methods for passing to child components
  const practiceDiary = {
    loaded: practiceDiaryLoaded,
    entries: practiceDiaryEntries,
    containsTune: practiceDiaryContainsTune,
    containsSetting: practiceDiaryContainsSetting,
    tuneHasBeenPracticed: tuneHasBeenPracticed,
    getWishlist: getPracticeWishList,
    add: addToPracticeDiary,
  }

  const managePreferredTuneSettings = (action, tuneId, settingId = -1) => {
    if (action === "set" && settingId >= 0) {
      setPreferredTuneSettings((oldTuneSettings) => ({
        ...oldTuneSettings,
        [tuneId]: settingId,
      }))
    }
    if (action === "remove") {
      const newSettings = { ...preferredTuneSettings }
      delete newSettings[tuneId]
      setPreferredTuneSettings(newSettings)
    }
  }

  // LOAD preferred tune settings on mount
  useEffect(() => {
    console.log("App.js useEffect(): Load preferredSettings on mount")
    const savedPreferredSettings = JSON.parse(
      localStorage.getItem("preferredSettings")
    )
    if (savedPreferredSettings) {
      console.log(
        "Found preferredSettings in localStorage:",
        savedPreferredSettings
      )
      setPreferredTuneSettings(savedPreferredSettings)
    } else {
      console.log("No saved preferredSettings found")
    }
    setPrefTuneSettingsLoaded(true)
  }, [])

  // LOAD user preferences on mount
  useEffect(() => {
    console.group("App.js useEffect(): Load userPrefs on mount")
    const savedUserPrefs = JSON.parse(localStorage.getItem("userPrefs"))
    if (savedUserPrefs) {
      console.log("Found saved savedUserPrefs")
      setUserPrefs(savedUserPrefs)
    } else {
      console.log("No saved savedUserPrefs found - setting all to defaults.")
      setUserPrefs(defaultUserPrefs)
    }
    console.groupEnd()
    setUserPrefsLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // LOAD practice diary on mount
  useEffect(() => {
    console.group("App.js useEffect(): Load practice diary on mount")
    const savedPracticeDiary = JSON.parse(localStorage.getItem("practiceDiary"))
    if (savedPracticeDiary) {
      console.log("Loaded practiceDiary:", savedPracticeDiary)
      setPracticeDiaryEntries(savedPracticeDiary)
    } else {
      console.log("No saved practiceDiary found")
    }
    setPracticeDiaryLoaded(true)
    console.groupEnd()
  }, [])

  // SAVE preferred tune settings when they change, if already mounted
  useEffect(() => {
    if (prefTuneSettingsLoaded) {
      console.log("Saving preferredSettings as:", preferredTuneSettings)
      localStorage.setItem(
        "preferredSettings",
        JSON.stringify(preferredTuneSettings)
      )
    }
  }, [preferredTuneSettings, prefTuneSettingsLoaded])

  // SAVE user preferences when they change, if already mounted
  useEffect(() => {
    if (userPrefsLoaded) {
      console.log("Saving userPrefs as:", userPrefs)
      localStorage.setItem("userPrefs", JSON.stringify(userPrefs))
    }
  }, [userPrefs, userPrefsLoaded])

  // SAVE practice diary when it changes, if already mounted
  useEffect(() => {
    if (practiceDiaryLoaded) {
      console.log("Saving practiceDiary as:", practiceDiaryEntries)
      localStorage.setItem(
        "practiceDiary",
        JSON.stringify(practiceDiaryEntries)
      )
    }
  }, [practiceDiaryEntries, practiceDiaryLoaded])

  return (
    <div className="App" data-testid="App">
      <Navigation practiceDiary={practiceDiary} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredTuneSettings={preferredTuneSettings}
              managePreferredTuneSettings={managePreferredTuneSettings}
            />
          }
        />

        <Route
          path="/tune/:tuneId"
          element={
            <TuneNotation
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredSettings={preferredTuneSettings}
              managePreferredSettings={managePreferredTuneSettings}
            />
          }
        ></Route>

        <Route
          path="/set/:setId"
          element={
            <TuneNotation
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredSettings={preferredTuneSettings}
              managePreferredSettings={managePreferredTuneSettings}
            />
          }
        ></Route>

        <Route
          path="/tunebook"
          element={
            <TuneBook
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredSettings={preferredTuneSettings}
              managePreferredSettings={managePreferredTuneSettings}
            />
          }
        >
          <Route
            path="tune/:tuneId"
            element={
              <TuneNotation
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                preferredSettings={preferredTuneSettings}
                managePreferredSettings={managePreferredTuneSettings}
              />
            }
          />
        </Route>

        <Route
          path="/practice"
          element={
            <Practice
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredSettings={preferredTuneSettings}
              managePreferredSettings={managePreferredTuneSettings}
            />
          }
        >
          <Route
            path="tune/:tuneId"
            element={
              <TuneNotation
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                preferredSettings={preferredTuneSettings}
                managePreferredSettings={managePreferredTuneSettings}
              />
            }
          />
          <Route
            path="set/:setId"
            element={
              <TuneNotation
                filters={filters}
                setFilters={setFilters}
                userPrefs={userPrefs}
                setUserPrefs={setUserPrefs}
                practiceDiary={practiceDiary}
                preferredSettings={preferredTuneSettings}
                managePreferredSettings={managePreferredTuneSettings}
              />
            }
          />
        </Route>

        <Route
          path="/record"
          element={
            <Record
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredTuneSettings={preferredTuneSettings}
              managePreferredTuneSettings={managePreferredTuneSettings}
              recordings={recordings}
              setRecordings={setRecordings}
            />
          }
        />

        <Route
          path="/prefs"
          element={
            <UserPrefs
              filters={filters}
              setFilters={setFilters}
              userPrefs={userPrefs}
              setUserPrefs={setUserPrefs}
              practiceDiary={practiceDiary}
              preferredSettings={preferredTuneSettings}
              managePreferredSettings={managePreferredTuneSettings}
            />
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  )
}
export default App

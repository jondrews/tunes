import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import HomePage from "./components/HomePage/HomePage"
import PageNotFound from "./components/PageNotFound/PageNotFound"
import TuneNotation from "./components/TuneNotation/TuneNotation"
import TuneBook from "./components/TuneBook/TuneBook"
import Navigation from "./components/Navigation/Navigation"
import Practice from "./components/Practice/Practice"
import "./App.css"

const App = () => {
  const [resultsList, setResultsList] = useState([]) // array of Objects
  const [tuneBook, setTuneBook] = useState([]) // array of Objects
  const [filters, setFilters] = useState({
    type: "",
    mode: { key: "", modeType: "major" },
    q: "",
    inTuneBook: false,
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
              />
            }
          />

          <Route
            path="/tune"
            element={
              <TuneNotation
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
              />
            }
          >
            <Route
              path=":tuneId"
              element={
                <TuneNotation
                  tuneBook={tuneBook}
                  toggleTuneBookEntry={toggleTuneBookEntry}
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
              />
            }
          >
            <Route
              path=":tuneId"
              element={
                <TuneNotation
                  tuneBook={tuneBook}
                  toggleTuneBookEntry={toggleTuneBookEntry}
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

// +Sharps/-flats, Major, Aeolian, Dorian, Mixolydian,
// keySignatures = {
//   '-16': [Bbbb, Gbbm, Cbbdor, Fbbmix],
//   '-15': [Fbb, Dbbm, Gbbdor, Cbbmix],
//   '-14': [Cbb, Abbm, Dbbdor, Gbbmix],
//   '-13': [Gbb, Ebbm, Abbdor, Dbbmix],
//   '-12': [Dbb, Bbbm, Ebbdor, Abbmix],
//   '-11': [Abb, Fbm, Bbbdor, Ebbmix],
//   '-10': [Ebb, Cbm, Fbdor, Bbbmix],
//   '-9': [Bbb, Gbm, Cbdor, Fbmix],
//   '-8': [Fb, Dbm, Gbdor, Cbmix],
//   '-7': [Cb, Abm, Dbdor, Gbmix],
//   '-6': [Gb, Ebm, Abdor, Dbmix],
//   '-5': [Db, Bbm, Ebdor, Abmix],
//   '-4': [Ab, Fm, Bbdor, Ebmix],
//   '-3': [Eb, Cm, Fdor, Bbmix],
//   '-2': [Bb, Gm, Cdor, Fmix],
//   '-1': [F, Dm, Gdor, Cmix],
//   'O': [C, Am, Ddor, Gmix],
//   '1': [G, Em, Ador, Dmix],
//   '2': [D, Bm, Edor, Amix],
//   '3': [A, F#mm, Bdor, Emix],
//   '4': [E, C#mm, F#dor, Bmix],
//   '5': [B, G#mm, C#dor, F#mix],
//   '6': [F#, D#mm, G#dor, Cmix],
//   '7': [C#, A#mm, D#dor, G#mix],
//   '8': [G#, E#mm, A#dor, D#mix],
//   '9': [D#, B#mm, E#dor, A#mix],
//   '10': [A#, FXm, B#dor, E#mix],
//   '11': [E#, Cxm, F#dor, B#mix],
//   '12': [B#, Gxm, Cxdor, Fxmix],
//   '13': [Fx, Dxm, Gxdor, Cxmix],
//   '14': [Cx, Axm, Dxdor, Gxmix],
//   '15': [Gx, Exm, Axdor, Dxmix],
//   '16': [Dx, Bxm, Exdor, Axmix],
// }

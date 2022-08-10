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
    mode: { key: "", modeType: "" },
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

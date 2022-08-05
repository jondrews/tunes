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

  const isInTuneBook = (lookFor) => {
    return tuneBook.some((bookEntry) => bookEntry.tuneObject.id === lookFor.tuneObject.id)
  }

  const toggleTuneBookEntry = (bookEntry) => {
    console.log(`Tunebook before changes:`, tuneBook)
    console.log(`bookEntry argument:`, bookEntry)
    if (isInTuneBook(bookEntry)) {
      console.log(`Removing tune ${bookEntry.tuneObject.id} from tunebook`)
      const newTuneBook = tuneBook.filter((entry) => entry.tuneObject.id !== bookEntry.tuneObject.id)
      setTuneBook(newTuneBook)
    } else {
      console.log(`Adding tune ${bookEntry.tuneObject.id} to tunebook`)
      const newEntry = {
        'tuneObject': resultsList.filter((tune) => tune.id === bookEntry.tuneObject.id)[0],
        'dateAdded': bookEntry.dateAdded
      }
      const newTuneBook = [newEntry, ...tuneBook]
      setTuneBook(newTuneBook)
    }
    console.log(`Tunebook after changes:`, tuneBook)
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
              />
            }
          />
          <Route path="/tune" element={<TuneNotation />}>
            <Route path=":tuneId" element={<TuneNotation />} />
          </Route>
          <Route
            path="/tunebook"
            element={
              <TuneBook
                tuneBook={tuneBook}
                toggleTuneBookEntry={toggleTuneBookEntry}
              />
            }
          />
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

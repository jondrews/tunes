import React from "react"

import { useState, useEffect } from "react"
// import { Stack, Button } from 'react-bootstrap'
import TuneResult from "../TuneResult/TuneResult"
import "./HomePage.css"

export default function HomePage({ tuneBook, toggleTuneBookEntry, setResultsList, resultsList }) {
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const url = `https://thesession.org/tunes/popular?perpage=20&page=${page}&format=json`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTotalPages(data.pages)
        setTotalResults(data.total)
        if (page === 1) {
          // normal state update method
          setResultsList(data.tunes)
        } else {
          // using a functional update method here, to prevent an infinte loop:
          // https://reactjs.org/docs/hooks-reference.html#functional-updates
          setResultsList((prevResultsList) => [...prevResultsList, ...data.tunes])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [page, setResultsList])

  return (
    <div className="Homepage scrollable">
      <h2>Popular tunes</h2>

      <div className="results d-flex flex-column align-items-center">
        {resultsList.map((tune) => (
          <TuneResult
            key={tune.id}
            id={tune.id}
            title={tune.name}
            popularity={tune.tunebooks}
            tuneType={tune.type}
            date={tune.date}
            toggleTuneBookEntry={toggleTuneBookEntry}
          />
        ))}

        <div className="more-results m-3 d-flex flex-column align-items-center">
          Showing {resultsList.length} out of {totalResults} tunes found
          <div
            className="more-results-button btn btn-outline-primary"
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1)
              }
            }}
          >
            Show more
          </div>
        </div>
      </div>
    </div>
  )
}

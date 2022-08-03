import React from 'react'

import { useState, useEffect } from 'react'
// import { Stack, Button } from 'react-bootstrap'
import TuneResult from '../TuneResult/TuneResult'
import './HomePage.css'

export default function HomePage() {
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  // const [page, setPage] = useState(1)
  const page = 1
  const [tuneList, setTuneList] = useState([])  // array of Objects

  useEffect(() => {
    const url = `https://thesession.org/tunes/popular?format=json`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setTotalPages(data.pages)
        setTotalResults(data.total)
        if (page === 1) {
          // normal state update method
          setTuneList(data.tunes)
        } else {
          // using a functional update method here, to prevent an infinte loop:
          // https://reactjs.org/docs/hooks-reference.html#functional-updates
          setTuneList((prevTuneList) => [...prevTuneList, ...data.tunes])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [page])
  
  return (
    <div className='Homepage scrollable'>
      <h2>Popular tunes</h2>
      Total Results: { totalResults }<br />
      Total Pages: { totalPages }<br />
      <div className="results">
        {tuneList.map((tune) => (
          <TuneResult 
            key={tune.id}
            id={tune.id}
            title={tune.name}
            popularity={tune.tunebooks}
            tuneType={tune.type}
            date={tune.date}
          />
        ))}
      </div>
    </div>
  )
}

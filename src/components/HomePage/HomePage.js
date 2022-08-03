import React from 'react'
import abcjs from "abcjs"

import { useState, useEffect } from 'react'
// import { Stack, Button } from 'react-bootstrap'
import TuneResult from '../TuneResult/TuneResult'
import './HomePage.css'

export default function HomePage() {
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [tuneList, setTuneList] = useState([])  // array of Objects

  useEffect(() => {
    abcjs.renderAbc("test-notation", "X:1\nK:D\nDDAA|BBA2|\n")

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
      {/* <Stack direction="horizontal" gap={2}>
        <Button as="a" variant="primary">
          Primary button test
        </Button>
        <Button as="a" variant="outline-success">
          Success button test
        </Button>
      </Stack>
      <div id="test-notation"></div> */}

      Total Results: { totalResults }<br />
      Total Pages: { totalPages }<br />
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
      <br />
      <br />
      <br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
      blah blah<br />
    </div>
  )
}

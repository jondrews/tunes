import React from "react"
import { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import FilterSelect from "../FilterSelect/FilterSelect"
import TuneResult from "../TuneResult/TuneResult"
import "./HomePage.css"

export default function HomePage({
  tuneBook,
  toggleTuneBookEntry,
  setResultsList,
  resultsList,
  filters,
  setFilters,
}) {
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [showFilterOptions, setShowFilterOptions] = useState(false)

  useEffect(() => {
    const filterString = `type=${filters.type}&mode=${
      filters.mode.key
        ? filters.mode.key + (filters.mode.modeType || "major")
        : ""
    }&q=${filters.q}`
    const url = `https://thesession.org/tunes/search?${filterString}&perpage=20&page=${page}&format=json`
    console.log("API Call URL:", url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("data from API", data)
        setTotalPages(data.pages)
        setTotalResults(data.total)
        if (page === 1) {
          setResultsList(data.tunes)
        } else {
          setResultsList((prevResultsList) => [
            ...prevResultsList,
            ...data.tunes,
          ])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [page, setResultsList, filters])

  return (
    <div className="Homepage scrollable">
      <div className="discover-header d-flex">
        <h2>Discover tunes</h2>
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="btn btn-outline-success"
        >
          {showFilterOptions ? "hide filter" : "show filter"}
        </button>
      </div>
      {showFilterOptions && (
        <FilterSelect
          filters={filters}
          setFilters={setFilters}
          setResultsList={setResultsList}
          setPage={setPage}
        />
      )}
      {/* <div className="results d-flex flex-column align-items-center">
        {resultsList.map((tune) => (
          <TuneResult
            key={tune.id}
            id={tune.id}
            title={tune.name}
            popularity={tune.tunebooks}
            tuneType={tune.type}
            date={tune.date}
            tuneBook={tuneBook}
            toggleTuneBookEntry={toggleTuneBookEntry}
            filters={filters}
            setFilters={setFilters}
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
      </div> */}
      {totalResults} tunes found
      <InfiniteScroll
        dataLength={resultsList.length} //This is important field to render the next data
        next={() => setPage(page + 1)}
        hasMore={page < totalPages}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p className="end-of-results" style={{ textAlign: "center" }}>
            <b>
              Showing {resultsList.length} out of {totalResults} tunes found
            </b>
          </p>
        }
        // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
      >
        <div className="results d-flex flex-column align-items-center">
          {resultsList.map((tune) => (
            <TuneResult
              key={tune.id}
              id={tune.id}
              title={tune.name}
              popularity={tune.tunebooks}
              tuneType={tune.type}
              date={tune.date}
              tuneBook={tuneBook}
              toggleTuneBookEntry={toggleTuneBookEntry}
              filters={filters}
              setFilters={setFilters}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

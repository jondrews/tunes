import Pluralize from "pluralize"
import { useState, useEffect, useCallback } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ClearIcon from "@mui/icons-material/Clear"
import PulseLoader from "react-spinners/PulseLoader"

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
  // resultsStatus can be 'initialising', 'searching', 'checking results', 'results found' or 'no results'
  const [resultsStatus, setResultsStatus] = useState("initialising")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  Pluralize.addPluralRule(/waltz/i, "waltzes") // 🙄

  const dealWithresults = useCallback(
    (data) => {
      console.log("DEALING WITH VALID RESULTS")
      setResultsStatus("results found")
      setTotalPages(data.pages)
      setTotalResults(data.total)
      if (page === 1) {
        setResultsList(data.tunes)
        console.log("Just loaded first page of results")
      } else {
        setResultsList((prevResultsList) => [...prevResultsList, ...data.tunes])
        console.log("Just loaded another page of results")
      }
    },
    [page, setResultsList]
  )

  useEffect(() => {
    const filterString = `type=${filters.type}&mode=${
      filters.mode.key
        ? filters.mode.key + (filters.mode.modeType || "major")
        : ""
    }&q=${filters.q}`
    console.group('Filter settings:')
    console.log('filters.type', filters.type)
    console.log('filters.mode.key', filters.mode.key)
    console.log('filters.mode.modeType', filters.mode.modeType)
    console.log('filters.q', filters.q)
    console.log('filterString', filterString)
    console.groupEnd()
    const url = `https://thesession.org/tunes/search?${filterString}&perpage=20&page=${page}&format=json`
    console.log("A1. about to send filtered API call")
    setResultsStatus("searching")
    fetch(url)
      .then((response) => {
        console.log("A2. got filtered API response", response)
        return response.json()
      })
      .then((data) => {
        console.log('API data received:', data)
        if (
          (filters.type || filters.mode.key || filters.q) &&
          data.total > 1000
        ) {
          setResultsStatus("checking results")
          /* Check if number of results equals the size of the given request 
            without any key/mode filtering.
            (If it does, the server found NO RESULTS for the given filters) */
          const testString = `type=${filters.type}&q=${filters.q}`
          const entireArchiveUrl =
            `https://thesession.org/tunes/search?${testString}&format=json`
          console.log(
            "B1. >1000 filtered results. About to send unfiltered API call"
          )
          fetch(entireArchiveUrl)
            .then((entireArchive) => {
              console.log("B2. got un-filtered API response")
              return entireArchive.json()
            })
            .then((entireArchiveData) => {
              console.log("Setting archiveSize to:", entireArchiveData.total)
              console.log("Filtered results list size:", data.total)
              if (data.total >= entireArchiveData.total) {
                console.log(
                  "B3. No results found. Filtered list is same size as entire archive"
                )
                setResultsStatus("no results")
                setResultsList([])
                console.log("B3. resultsList has been set to EMPTY LIST")
              } else {
                dealWithresults(data)
              }
            })
        } else if (data.total === 0) {
          console.log("B4. No results returned from server")
          setResultsStatus("no results")
          setResultsList([])
        } else {
          dealWithresults(data)
        }
      })
      .catch((error) => {
        console.log("error caught on HomePage:", error)
      })
  }, [page, setResultsList, filters, dealWithresults])

  return (
    <div className="HomePage">
      {resultsStatus}
      <div className="discover-header">
        <h2>Discover tunes</h2>
        <button
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          className="filters-expand-button btn"
        >
          {showFilterOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          {showFilterOptions ? "hide filters" : "show filters"}
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

      <div className="filters-verbose d-flex">
        {["initialising", "searching", "checking results"].indexOf(
          resultsStatus
        ) > -1 && <p>Searching...</p>}
        {resultsStatus === "results found" && (
          <p>
            {(filters.type !== "" || filters.mode.key !== "" || filters.q !== "") 
              ? ("Found " + totalResults + " ") 
              : ("Showing all " + totalResults + " ")
            }
            {filters.type ? Pluralize(filters.type, 2) : "tunes"}
            {filters.mode.key &&
              " with settings in " +
                filters.mode.key +
                " " +
                (filters.mode.modeType || "major")}
          </p>
        )}
        {resultsStatus === "no results" && <p>No results</p>}
      </div>

      {(filters.type !== "" || filters.mode.key !== "" || filters.q !== "") && (
        <div className="clear-filters d-flex">
          <button
            className="clear-filters-button"
            onClick={() => {
              setFilters({
                type: "",
                mode: { key: "", modeType: "" },
                q: "",
                inTuneBook: false,
              })
              setResultsList([])
              setPage(1)
            }}
          >
            <ClearIcon /> clear filters
          </button>
        </div>
      )}

      <InfiniteScroll
        dataLength={resultsList.length}
        next={() => setPage(page + 1)}
        hasMore={page < totalPages}
        loader={resultsStatus !== "no results" && page < totalPages && <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100px" }}
        >
          <PulseLoader />
        </div>}
        endMessage={
          <p className="end-of-results" style={{ textAlign: "center" }}>
            <b>
              Showing {resultsList.length} out of {totalResults} tunes found
            </b>
          </p>
        }
      >
        <div className="results">
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
              setResultsList={setResultsList}
              setPage={setPage}
            />
          ))}
        </div>
      </InfiniteScroll>

    </div>
  )
}

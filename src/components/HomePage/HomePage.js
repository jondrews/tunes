import { useState, useEffect } from "react"
import ClearIcon from "@mui/icons-material/Clear"
import InfiniteScroll from "react-infinite-scroll-component"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import Pluralize from "pluralize"
import PulseLoader from "react-spinners/PulseLoader"

import FilterSelect from "../FilterSelect/FilterSelect"
import TuneResult from "../TuneResult/TuneResult"
import "./HomePage.css"

export default function HomePage({
  filters,
  setFilters,
  userPrefs,
  setUserPrefs,
}) {
  const [resultsFromServer, setResultsFromServer] = useState({})
  const [checkedResults, setCheckedResults] = useState([]) // array of Objects (tunes)
  const [resultsDisplay, setResultsDisplay] = useState([]) // array of <TuneResult> components
  /* resultsStatus can be 'error', 'initialising', 'searching', 
     'checking results', 'results found' or 'no results' */
  const [resultsStatus, setResultsStatus] = useState("initialising")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [duplicates, setDuplicates] = useState(0)
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  Pluralize.addPluralRule(/waltz/i, "waltzes") // 🙄

  const resetResults = () => {
    setResultsStatus("no results")
    setTotalResults(0)
    setTotalPages(0)
    setResultsFromServer({})
    setCheckedResults([])
    setResultsDisplay([])
    setDuplicates(0)
    setPage(1)
  }

  const addNonDuplicates = () => {
    console.log(
      `addNonDuplicates() called: Checking for duplicates that are already in resultsDisplay`
    )
    const checkedData = { ...resultsFromServer, tunes: [] }
    resultsFromServer.tunes.forEach((result) => {
      if (isInResultsDisplay(result.id)) {
        console.log(
          `######### Tune #${result.id} is already in resultsDisplay. OMITTING #############`
        )
        setDuplicates(duplicates + 1)
      } else {
        console.log(`Adding tune #${result.id}.`)
        checkedData.tunes.push({ ...result })
      }
    })
    console.log("checkedData - setting checkedResults state:", checkedData)
    setCheckedResults(checkedData)
    setResultsStatus("results found")
    console.groupEnd()
    // clear resultsFromServer, ready for next set of results from API
    setResultsFromServer({})
  }

  const isInResultsDisplay = (tuneId) => {
    return resultsDisplay.some((tune) => tune.id === tuneId)
  }

  /* --------------------------------------------------------------------------
     1. Request a page of results from API. 
     Triggered by change in 'page' or 'filters' state.
     ------------------------------------------------------------------------*/
  useEffect(() => {
    console.log("=== useEffect() #1 called ===")
    if (resultsStatus !== ("searching" || "checking results")) {
      const filterString = `type=${filters.type}&mode=${
        filters.mode.key
          ? filters.mode.key + (filters.mode.modeType || "major")
          : ""
      }&q=${filters.q}`
      const url = `https://thesession.org/tunes/search?${filterString}&perpage=20&page=${
        page ? page : 1
      }&format=json`
      console.log(`API call:`, url)
      setResultsStatus("searching")
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(`Got API response. Data = `, data)
          setResultsFromServer(data)
        })
        .catch((error) => {
          console.log("error caught on HomePage:", error)
          setResultsStatus("error")
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters])

  /* -------------------------------------------------------------------------
     2. Check recently received results from API for duplicates.
     Triggered by change in 'resultsFromServer' state. 
     ----------------------------------------------------------------------- */
  useEffect(() => {
    console.log("=== useEffect() #2 called ===")
    if (resultsFromServer.tunes && resultsFromServer.tunes.length > 0) {
      console.group(`resultsFromServer contains items`)
      setResultsStatus("checking results")
      var resultsToCheck = false

      /* Check to see if we have a zero-results response. 
         We need to do this if a 'key' filter is being used, because some
         (musical) keys are not used by thesession.org - but instead of 
         returning zero results for these keys, the server ignores the 'key' 
         filter and returns ALL matches of the resulting query. */
      console.log("Checking for zero-result server response")
      const THRESHOLD = 1000
      if (filters.mode.key && resultsFromServer.total > THRESHOLD) {
        console.log(
          `Received ${resultsFromServer.total} results - performing check`
        )
        const testString = `type=${filters.type}&q=${filters.q}`
        const entireArchiveUrl = `https://thesession.org/tunes/search?${testString}&format=json`
        console.log(`Test API call:`, entireArchiveUrl)
        fetch(entireArchiveUrl)
          .then((entireArchive) => entireArchive.json())
          .then((entireArchiveData) => {
            if (resultsFromServer.total >= entireArchiveData.total) {
              console.log(
                `ZERO-RESULT RESPONSE: resultsFromServer.total (${resultsFromServer.total}) >= entireArchiveData.total (${entireArchiveData.total})`
              )
              setResultsStatus("no results")
              setResultsFromServer({})
              setTotalResults(0)
              setTotalPages(0)
              setPage(1) // TODO: Check if this triggers an API call
            } else {
              console.log(
                `RESULTS OK: resultsFromServer.total (${resultsFromServer.total}) < entireArchiveData.total (${entireArchiveData.total})`
              )
              setTotalPages(resultsFromServer.pages)
              setTotalResults(resultsFromServer.total)
              addNonDuplicates()
            }
          })
      } else if (resultsFromServer.total === 0) {
        console.log("NO RESULTS: Not performing check")
        setResultsStatus("no results")
        setResultsFromServer({})
        setTotalResults(0)
        setTotalPages(0)
        setPage(1) // TODO: Check if this triggers an API call
      } else {
        console.log(
          "RESULTS OK: Key filter not set, or results length under threshold"
        )
        setTotalPages(resultsFromServer.pages)
        setTotalResults(resultsFromServer.total)
        addNonDuplicates()
      }
    } else {
      // resultsFromServer changed, but resultsFromServer.tunes is zero-length
      console.log(`resultsFromServer empty`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsFromServer])

  /* -------------------------------------------------------------------------
     3. Build a list of <TuneResult> components for rendering to UI
     ----------------------------------------------------------------------- */
  useEffect(() => {
    console.log("=== useEffect() #3 called ===")
    if (checkedResults.tunes && checkedResults.tunes.length > 0) {
      checkedResults.tunes.forEach((tune) => {
        console.log(`Adding tune #${tune.id} to resultsDisplay`)
        setResultsDisplay((oldResults) => [...oldResults, tune])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedResults])

  return (
    resultsDisplay &&
    userPrefs && (
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
            resetResults={resetResults}
            userPrefs={userPrefs}
            setUserPrefs={setUserPrefs}
          />
        )}

        <div className="filters-verbose d-flex">
          {[
            "initialising",
            "searching",
            "checking results",
            "fetching details",
          ].indexOf(resultsStatus) > -1 && <p>Searching...</p>}
          {resultsStatus === "results found" && (
            <p>
              {filters.type !== "" ||
              filters.mode.key !== "" ||
              filters.q !== ""
                ? "Found " + totalResults + " "
                : "Showing all " + totalResults + " "}
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

        {(filters.type !== "" ||
          filters.mode.key !== "" ||
          filters.q !== "") && (
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
                resetResults()
              }}
            >
              <ClearIcon /> clear filters
            </button>
          </div>
        )}

        <InfiniteScroll
          dataLength={resultsDisplay ? resultsDisplay.length : 0}
          scrollThreshold="50px"
          next={() => {
            if (resultsStatus === "results found") {
              console.log(
                `---- InfiniteScroll requesting page #${page + 1} ----`
              )
              setPage(page + 1)
            } else {
              console.log(`---- InfiniteScroll blocked by resultsStatus ----`)
            }
          }}
          hasMore={page < totalPages}
          loader={
            resultsStatus !== "no results" &&
            page < totalPages && (
              <div
                key="loader"
                className="d-flex align-items-center justify-content-center"
                style={{ height: "100px" }}
              >
                <PulseLoader />
              </div>
            )
          }
          endMessage={
            <p className="end-of-results" style={{ textAlign: "center" }}>
              <b>Found {resultsDisplay ? resultsDisplay.length : "0"} tunes</b>
            </p>
          }
        >
          <div className="results">
            {resultsDisplay.map((tune) => (
              <TuneResult
                key={tune.id}
                id={tune.id}
                name={tune.name}
                filters={filters}
                setFilters={setFilters}
                resetResults={resetResults}
                userPrefs={userPrefs}
              />
            ))}
          </div>

          <p className="end-of-results" style={{ textAlign: "center" }}>
            <b>
              Page {page} of {totalPages}. Showing {resultsDisplay.length} out
              of {totalResults - duplicates} tunes found
              {duplicates > 0 && ` (omitting ${duplicates} duplicates)`}.
            </b>
          </p>

          {resultsStatus === "results found" && page < totalPages && (
            <button
              className="next-page btn btn-outline-primary"
              onClick={() => {
                setPage(page + 1)
              }}
            >
              Load more...
            </button>
          )}
        </InfiniteScroll>
      </div>
    )
  )
}

import { useState, useEffect, useCallback } from "react"
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
  resultsList,
  setResultsList,
  filters,
  setFilters,
  userPrefs,
  setUserPrefs,
}) {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  // resultsStatus can be 'error', 'initialising', 'searching', 'checking results', 'fetching details', 'results found' or 'no results'
  const [resultsStatus, setResultsStatus] = useState("initialising")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  Pluralize.addPluralRule(/waltz/i, "waltzes") // 🙄

  const filterString = `type=${filters.type}&mode=${
    filters.mode.key
      ? filters.mode.key + (filters.mode.modeType || "major")
      : ""
  }&q=${filters.q}`

  const fetchDeetsForResults = useCallback(
    (data) => {
      setResultsStatus("fetching details")
      console.log("dealWithResults() called")
      setTotalPages(data.pages)
      setTotalResults(data.total)

      data.tunes.forEach((tune) => {
        console.log("Getting data for tune #", tune.id)
        const url = `https://thesession.org/tunes/${tune.id}?format=json`
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            console.log(`Data for tune #${tune.id}`, data)
            // determine if 'showOnlyPrimarySettings' filter is applicable
            if (
              userPrefs.showOnlyPrimarySettings &&
              (filters.mode.key || filters.mode.modeType)
            ) {
              // only add this result if the FIRST setting matches user filters
              if (
                `${data.settings[0].key}` ===
                `${
                  filters.mode.key +
                  (filters.mode.modeType ? filters.mode.modeType : "major")
                }`
              ) {
                console.log(
                  `TUNE ${data.id}'s primary setting is in ${
                    data.settings[0].key
                  } --> adding to list! (match: ${
                    filters.mode.key +
                    (filters.mode.modeType ? filters.mode.modeType : "major")
                  })`
                )
                setResultsList((oldList) => [...oldList, data])
              } else {
                console.log(
                  `TUNE ${data.id}'s primary setting is in ${
                    data.settings[0].key
                  } --> REJECT (no match: ${
                    filters.mode.key +
                    (filters.mode.modeType ? filters.mode.modeType : "major")
                  })`
                )
              }
            } else {
              // add all results to results list
              console.log(
                `showOnlyPrimarySettings=${userPrefs.showOnlyPrimarySettings}, filters.mode.key=${filters.mode.key}, filters.mode.modeType=${filters.mode.modeType}. adding tune ${tune.id} to results.`
              )
              setResultsList((oldList) => [...oldList, data])
            }
          })
      })
      setResultsStatus("results found")
    },
    [
      setResultsList,
      filters.mode.key,
      filters.mode.modeType,
      userPrefs.showOnlyPrimarySettings,
    ]
  )

  const checkResults = useCallback(
    (data) => {
      /* The server doesn't return zero results for a key/mode query with no 
       results, it returns the entire archive. This function deals with it. */
      setResultsStatus("checking results")
      console.log(`checkResults() called`)
      const THRESHOLD = 1000
      if (filters.mode.key && data.total > THRESHOLD) {
        console.log(`Received ${data.total} results - performing check`)
        const testString = `type=${filters.type}&q=${filters.q}`
        const entireArchiveUrl = `https://thesession.org/tunes/search?${testString}&format=json`
        console.log(`Test API call:`, entireArchiveUrl)
        fetch(entireArchiveUrl)
          .then((entireArchive) => entireArchive.json())
          .then((entireArchiveData) => {
            if (data.total >= entireArchiveData.total) {
              console.log(
                `data.total (${data.total}) >= entireArchiveData.total (${entireArchiveData.total}), so NO RESULTS`
              )
              setResultsStatus("no results")
              setResultsList([])
            } else {
              console.log(
                `data.total (${data.total}) < entireArchiveData.total (${entireArchiveData.total}), so RESULTS OK`
              )
              fetchDeetsForResults(data)
            }
          })
      } else if (data.total === 0) {
        console.log("Not performing check - no results to test")
        setResultsStatus("no results")
        setResultsList([])
      } else {
        console.log(
          "Not performing check - no key filter, or results size threshold not exceeded"
        )
        fetchDeetsForResults(data)
      }
    },
    [filters, fetchDeetsForResults, setResultsList]
  )

  useEffect(() => {
    if (
      resultsStatus !==
      ("searching" || "checking results" || "fetching details")
    ) {
      // const filterString = `type=${filters.type}&mode=${
      //   filters.mode.key
      //     ? filters.mode.key + (filters.mode.modeType || "major")
      //     : ""
      // }&q=${filters.q}`
      const url = `https://thesession.org/tunes/search?${filterString}&perpage=20&page=${page}&format=json`
      console.log(`A1. API call:`, url)
      setResultsStatus("searching")
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          checkResults(data)
        })
        .catch((error) => {
          console.log("error caught on HomePage:", error)
          setResultsStatus("error")
        })
    }
  }, [page, filters, filterString, checkResults])

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
            {filters.type !== "" || filters.mode.key !== "" || filters.q !== ""
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
        next={() => {
          if (resultsStatus === "results found") {
            console.log(`---- InfiniteScroll requesting page #${page + 1} ----`)
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
            <b>
              Showing {resultsList.length} out of {totalResults} tunes found
            </b>
          </p>
        }
      >
        <div className="results">
          {resultsList.map((tune) => (
            <TuneResult
              tune={tune}
              key={tune.id}
              filters={filters}
              setFilters={setFilters}
              setResultsList={setResultsList}
              setPage={setPage}
            />
          ))}
        </div>

        <p className="end-of-results" style={{ textAlign: "center" }}>
          <b>
            Page {page} of {totalPages}. Showing {resultsList.length} out of{" "}
            {totalResults} tunes found
          </b>
        </p>

        {resultsStatus === "results found" && (
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
}

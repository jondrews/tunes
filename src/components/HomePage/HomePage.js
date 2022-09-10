import Pluralize from "pluralize"
import { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ClearIcon from "@mui/icons-material/Clear"

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
  Pluralize.addPluralRule(/waltz/i, "waltzes") // 🙄

  useEffect(() => {
    const filterString = `type=${filters.type}&mode=${
      filters.mode.key
        ? filters.mode.key + (filters.mode.modeType || "major")
        : ""
    }&q=${filters.q}`
    const url = `https://thesession.org/tunes/search?${filterString}&perpage=20&page=${page}&format=json`
    let noResults = false
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const numFilteredResults = data.total
        if (numFilteredResults > 1000) {
          /* Check if number of results equals the size of the entire archive
            (this means the server found NO RESULTS for the given filters) */
          const entireArchiveUrl =
            "https://thesession.org/tunes/search?format=json"
          fetch(entireArchiveUrl)
            .then((entireArchive) => entireArchive.json())
            .then((entireArchiveData) => {
              console.log("Entire archive size is:", entireArchiveData.total)
              console.log("Size of filtered results is:", numFilteredResults)
              noResults =
                numFilteredResults === entireArchiveData.total &&
                (filters.type || filters.mode.key || filters.q)
              console.log(noResults 
                ? 'NO RESULTS' 
                : filters.type || filters.mode.key || filters.q
                  ? 'Found some results with filters set'
                  : 'Showing entire archive')
            })
        }
        setTotalPages(numFilteredResults)
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
        console.log("error caught on HomePage:", error)
      })
  }, [page, setResultsList, filters])

  return (
    <div className="HomePage">
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
        <p>
          {(filters.type !== "" ||
            filters.mode.key !== "" ||
            filters.q !== "") &&
            "Filtered results: "}
          {"Found " + totalResults + " "}
          {filters.type ? Pluralize(filters.type, 2) : "tunes"}
          {filters.mode.key &&
            " with settings in " +
              filters.mode.key +
              " " +
              (filters.mode.modeType || "major")}
        </p>
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
        loader={<h4>Loading...</h4>}
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

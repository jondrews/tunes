import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import abcjs from "abcjs"

import "./TuneNotation.css"

export default function TuneNotation() {
  const [dimensions, setDimensions] = useState({
    height: document.getElementById("notation-container")
      ? document.getElementById("notation-container").clientHeight
      : 750,
    width: document.getElementById("notation-container")
      ? document.getElementById("notation-container").clientWidth
      : 750,
  })
  let params = useParams()

  // NOTE for parsing time signatures:
  // Barndance, Reel, Hornpipe, Strathspey	4/4
  // Jig	6/8
  // Waltz, Mazurka	3/4
  // Polka	2/4
  // Slide	12/8
  // Slip jig	9/8
  // Three-two	3/2
  // The default note length in each case is 1/8.

  const renderNotation = (element, tune, windowWidth) => {
    console.log("Rendering tune data from API:", tune)
    let abc = tune.settings[0].abc
    abc = abc.replace(/\|!/g, "|")
    console.log("Erroneous exclamation marks removed:", abc)
    abc = abc.replace(/:\| \|:/g, "::")
    console.log("Double barline spaces removed:", abc)
    abcjs.renderAbc(
      element,
      `X:1\nT:${tune.name}\nK:${tune.settings[0].key}\n${abc}\n`,
      {
        staffwidth: windowWidth * 0.9,
        wrap: {
          minSpacing: 1.8,
          maxSpacing: 2.6,
          preferredMeasuresPerLine: Math.round(windowWidth / 200),
        },
      }
    )
  }

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: document.getElementById("notation-container")
          ? document.getElementById("notation-container").clientHeight
          : 750,
        width: document.getElementById("notation-container")
          ? document.getElementById("notation-container").clientWidth
          : 750,
      })
    }
    window.addEventListener("resize", handleResize)

    const url = `https://thesession.org/tunes/${params.tuneId}?format=json`
    if (params.tuneId) {
      fetch(url)
        // .then((response) => catchError(response))
        .then((response) => response.json())
        .then((data) => {
          console.log(`Tune ${params.tuneId} data:`, data)
          // 'settings' here refers to the settings (variants) of a folk tune
          // setTuneData(data.settings[0])
          renderNotation("notation", data, dimensions.width)
        })
        .catch((error) => {
          console.log(`.catch method caught an error!:`, error)
          // setDeets('error')
        })
    }
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [params.tuneId, dimensions.width])

  return (
    <div className="notation-container" id="notation-container">
      <div className="notation" id="notation"></div>
      width of this div = {dimensions.width}
    </div>
  )
}

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import abcjs from 'abcjs'

import './TuneNotation.css'

export default function TuneNotation() {
  const [tuneData, setTuneData] = useState()
  let params = useParams()

  const renderNotation = (element, tune) => {
    abcjs.renderAbc(element, `X:1\nK:${tune.key}\n${tune.abc}\n`, {staffwidth: 740, wrap: { minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 }})
  }

  useEffect(() => {
    const url = `https://thesession.org/tunes/${params.tuneId}?format=json`

    if (params.tuneId) {
      fetch(url)
        // .then((response) => catchError(response))
        .then((response) => response.json())
        .then((data) => {
          // console.log(`Tune ${props.id} data:`, data)
          // 'settings' here refers to the settings (variants) of a folk tune
          setTuneData(data.settings[0])
          renderNotation('notation', data.settings[0])
        })
        .catch((error) => {
          console.log(`.catch method caught an error!:`, error)
          // setDeets('error')
        })
    }
  }, [params.tuneId])

  return (
    <>
      <div>TuneNotation</div>
      
      Sheet music for tune {params.tuneId}:
      <div className="notation" id="notation"></div>
    </>
  )
}

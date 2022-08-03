import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import abcjs from 'abcjs'

import './TuneResult.css'

export default function TuneResult(props) {
  const [tuneData, setTuneData] = useState()
  const navigate = useNavigate()

  const renderNotation = (element, tune) => {
    abcjs.renderAbc(element, `X:1\nK:${tune.key}\n${tune.abc.slice(0,30)}\n`, { responsive: "resize" })
  }


  useEffect(() => {
    const url = `https://thesession.org/tunes/${props.id}?format=json`

    if (props.id) {
      fetch(url)
        // .then((response) => catchError(response))
        .then((response) => response.json())
        .then((data) => {
          console.log(`Tune ${props.id} data:`, data)
          setTuneData(data.settings[0])
          // 'settings' here refers to the settings (variants) of a folk tune
          renderNotation(`${props.id}insipit`, data.settings[0])
        })
        .catch((error) => {
          console.log(`.catch method caught an error!:`, error)
          // setDeets('error')
        })
    }
  }, [props.id])

  return (
    <div className='TuneResult mt-2' onClick={() => navigate(`/tune/${props.id}`)}>
      <div className="tune-info d-flex">
        <div className="tune-title flex-grow-1">
          <h4>{props.title}</h4>
        </div>
        <div className="tune-type">
          {props.tuneType}
        </div>
        <div className="tune-key">
          {tuneData ? tuneData.key : ""}
        </div>
      </div>

      <div 
        className="tune-insipit"
        id={props.id + 'insipit'}
      ></div>
    </div>
  )
}

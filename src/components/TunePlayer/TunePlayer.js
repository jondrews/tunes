import React from 'react'
import { useParams } from 'react-router-dom'

import './TunePlayer.css'

export default function TunePlayer() {
  let params = useParams()

  return (
    <>
      <div>TunePlayer</div>
      
      Playing tune {params.tuneId}
    </>
  )
}

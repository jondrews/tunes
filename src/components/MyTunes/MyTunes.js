import React from 'react'
import TuneNotation from '../TuneNotation/TuneNotation'
import './MyTunes.css'

export default function MyTunes() {
  return (
    <div>
      Tunes
      <div className='TunePlayer'>
        <TuneNotation />
      </div>
    </div>
  )
}

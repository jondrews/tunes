import React from 'react'
import TunePlayer from '../TunePlayer/TunePlayer'
import './MyTunes.css'

export default function MyTunes() {
  return (
    <div>
      MyTunes
      <div className='TunePlayer'>
        <TunePlayer />
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import WaveSurfer from "wavesurfer.js"
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa"

import "./Waveform.css"

export default function Waveform({ audio }) {
  const containerRef = useRef()
  const waveSurferRef = useRef({
    isPlaying: () => false,
  })
  const [isPlaying, toggleIsPlaying] = useState(false)

  useEffect(() => {
    console.log("INITIALISING WAVESURFER")
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      responsive: true,
      cursorWidth: 0,
      barWidth: 2,
      barHeight: 10,
    })
    waveSurfer.load(audio)
    waveSurfer.on("ready", () => {
      waveSurferRef.current = waveSurfer
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [audio])

  return (
    <div className="waveform-container">
      <button
        onClick={() => {
          waveSurferRef.current.playPause()
          toggleIsPlaying(waveSurferRef.current.isPlaying())
        }}
        type="button"
      >
        {isPlaying ? (
          <FaPauseCircle size="3em" className="pausebutton" />
        ) : (
          <FaPlayCircle size="3em" className="playbutton" />
        )}
      </button>
      <div ref={containerRef} className="waveform"></div>
    </div>
  )
}

Waveform.propTypes = {
  audio: PropTypes.string.isRequired,
}

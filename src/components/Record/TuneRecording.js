import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import "./TuneRecording.css"

export default function TuneRecording({ recording }) {
  const [elapsedTime, setElapsedTime] = useState("")

  useEffect(() => {
    const timeUpdater = setInterval(
      () => setElapsedTime(recording.date.toRelative({ base: DateTime.now() })),
      1000
    )
    return () => {
      clearInterval(timeUpdater)
    }
  }, [])

  return (
    // How to build an audio player:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics

    <div className="recording-item d-flex flex-column mb-3">
      {elapsedTime} (
      {recording.date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}):
      <audio src={recording.url} controls />
    </div>
  )
}

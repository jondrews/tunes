import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import "./TuneRecording.css"

export default function TuneRecording({ recording }) {
  const [elapsedTime, setElapsedTime] = useState("")

  // Keep time on the UI
  useEffect(() => {
    const timeUpdater = setInterval(
      () => setElapsedTime(recording.date.toRelative({ base: DateTime.now() })),
      1000
    )
    return () => {
      clearInterval(timeUpdater)
    }
  }, [recording.date])

  return (
    // How to build an audio player:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics

    <div className="recording-item d-flex flex-column mb-3">
      {elapsedTime} (
      {recording.date.toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}):
      <audio controls>
        <source src={recording.url} type="audio/mp3" />
        File type not supported: <a href={recording.file}>download mp3</a>
      </audio>
      <a href={recording.url}>download mp3</a>
      {recording.url}
    </div>
  )
}

import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import Waveform from "./Waveform"
import "./TuneRecording.css"

export default function TuneRecording({ recording }) {
  const [elapsedTime, setElapsedTime] = useState("")
  const [filename, setFilename] = useState("recording")
  const [useDatePrefix, setUseDatePrefix] = useState(true)
  const [audioUrl, setAudioUrl] = useState(null)
  const datePrefix = `${recording.date.toFormat("yyyy-MM-dd HH.mm.ss")}`

  const handleNameChange = (e) => {
    setFilename(e.target.value)
  }

  // const supportsShowSaveFilePicker = () => {
  //   return typeof(window.showSaveFilePicker)!="undefined"
  // }

  useEffect(() => {
    setAudioUrl(URL.createObjectURL(recording.blob))
  }, [])

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
    audioUrl && (
      // TODO: If supported, use showSaveFilePicker to determine if user has
      // downloaded the recording or not.

      <div className="recording-item d-flex flex-column m-3">
        <div className="elapsed-time">
          {elapsedTime}
        </div>
        <Waveform audio={audioUrl} />
        {/* <audio controls>
        <source src={recording.url} type="audio/mp3" />
        File type not supported: <a href={recording.blob}>download mp3</a>
      </audio> */}

        <div className="edit-filename d-flex flex-shrink-1">
        <a
          className="save-button btn btn-sm btn-outline-success"
          href={audioUrl}
          download={`${useDatePrefix && datePrefix}${
            filename && ` ${filename.trim()}`
          }.mp3`}
        >
          save
        </a>
          <div className="filename-input">
            {useDatePrefix && datePrefix}&nbsp;
            <input
              className="filename-input-textbox"
              type="text"
              value={filename}
              style={{width: `${filename.length}ch`}}
              onChange={(e) => handleNameChange(e)}
            ></input>
            .mp3
          </div>
        </div>
      </div>
    )
  )
}

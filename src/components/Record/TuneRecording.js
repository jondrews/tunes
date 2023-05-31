import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import Waveform from "./Waveform"
import FileDownloadIcon from '@mui/icons-material/FileDownload'

import "./TuneRecording.css"

export default function TuneRecording({ recording }) {
  const [elapsedTime, setElapsedTime] = useState("")
  const [filename, setFilename] = useState("recording")
  const [useDatePrefix, setUseDatePrefix] = useState(true)
  const [audioUrl, setAudioUrl] = useState(null)
  const datePrefix = `${recording.date.toFormat("yyyy-MM-dd HH.mm.ss")}`

  const handleFilenameChange = (e) => {
    setFilename(e.target.value)
  }

  const detectEnterPress = (e) => {
    if (e.key === "Enter") {
      document.getElementById("save-button").click()
    }
  }

  // const supportsShowSaveFilePicker = () => {
  //   return typeof(window.showSaveFilePicker)!="undefined"
  // }

  useEffect(() => {
    setAudioUrl(URL.createObjectURL(recording.blob))
  }, [recording.blob])

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
      <div className="TuneRecording m-3">
        <Waveform audio={audioUrl} />

        <div className="elapsed-time">{elapsedTime}</div>

        <div className="edit-filename-and-save d-flex flex-shrink-1">
          <div className="filename-input">
            <div
              className={`date-prefix d-inline ${
                useDatePrefix ? "dateprefixshown" : "dateprefixhidden"
              }`}
              onClick={() => setUseDatePrefix(!useDatePrefix)}
            >
              {useDatePrefix ? datePrefix : "[+date time]"}&nbsp;
            </div>
            <input
              className="filename-input-textbox text-truncate"
              type="text"
              value={filename}
              style={{
                width: `${Math.max(8, Math.min(filename.length, 30))}ch`,
              }}
              onChange={(e) => handleFilenameChange(e)}
              onKeyDown={(e) => detectEnterPress(e)}
            ></input>
            <div className="file-extension d-inline">.mp3</div>
          </div>

          <a
            id="save-button"
            className="save-button"
            href={audioUrl}
            download={
              useDatePrefix || filename
                ? `${
                    (useDatePrefix ? datePrefix + (filename ? " " : "") : "") +
                    (filename ? filename.trim() : "") +
                    ".mp3"
                  }`
                : "recording.mp3"
            }
          >
            <FileDownloadIcon />
          </a>
        </div>
      </div>
    )
  )
}

import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import ReactMic from "mic-recorder-to-mp3"

import MicIcon from "@mui/icons-material/Mic"
import StopCircleIcon from "@mui/icons-material/StopCircle"

import "./TuneRecorder.css"

export default function TuneRecorder({ setRecordings }) {
  const [recorder, setRecorder] = useState(null)
  const [capturingAudio, setCapturingAudio] = useState(false)

  // On mount, instantiate a MicRecorder() object.
  useEffect(() => {
    setRecorder(new ReactMic())
  }, [])

  const toggleRecord = () => {
    capturingAudio ? stopRecording() : startRecording()
  }

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        setCapturingAudio(true)
        console.log(
          `RECORDING STARTED - recorder.microphone =`,
          recorder.microphone
        )
      })
      .catch((e) => {
        console.log(`ERROR in startRecording:`, e)
      })
  }

  const stopRecording = () => {
    setCapturingAudio(false)
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const creationTime = DateTime.now()
        const url = URL.createObjectURL(blob)
        const newRecording = {
          url: url,
          buffer: buffer,
          blob: blob,
          date: creationTime,
        }
        setRecordings((existingRecordings) => [
          newRecording,
          ...existingRecordings,
        ])
      })
      .catch((e) => {
        console.log(`ERROR in stopRecording:`, e)
      })
  }

  return (
    <div className="TuneRecorder d-flex flex-column w-50 m-auto mb-5 p-3">
      {recorder ? (
        <div className="tunerecorder-controls m-auto">
          <button
            className={`tunerecorder-button ${capturingAudio ? "stop-button" : "record-button"}`}
            onClick={() => toggleRecord()}
          >
            {capturingAudio ? (
              <StopCircleIcon fontSize="large" />
            ) : (
              <MicIcon fontSize="large" />
            )}
          </button>
        </div>
      ) : (
        <p>Recorder not ready</p>
      )}
    </div>
  )
}

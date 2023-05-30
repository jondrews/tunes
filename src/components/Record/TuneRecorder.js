import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import ReactMic from "mic-recorder-to-mp3"
import "./TuneRecorder.css"

export default function TuneRecorder({ setRecordings }) {
  const [recorder, setRecorder] = useState(null) // a MediaRecorder() instance

  // On mount, instantiate a MicRecorder() object.
  useEffect(() => {
    setRecorder(new ReactMic())
  }, [])

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
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
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const creationTime = DateTime.now()
        // const file = new File(buffer, "recording.mp3", {
        //   type: blob.type,
        //   lastModified: creationTime,
        // })
        // const url = URL.createObjectURL(file)
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
      <div className="tunerecorder-header">
        <h2>Tune Recorder</h2>
      </div>

      {recorder ? (
        <div className="tunerecorder-controls">
          <button
            className="tunerecorder-button start-button btn"
            onClick={() => startRecording()}
          >
            start
          </button>

          <button
            className="tunerecorder-button stop-button btn"
            onClick={() => stopRecording()}
          >
            stop
          </button>
        </div>
      ) : (
        <p>Recorder not ready</p>
      )}
    </div>
  )
}

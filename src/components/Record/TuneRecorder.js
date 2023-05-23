import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import "./TuneRecorder.css"

export default function TuneRecorder({ setRecordings }) {
  const [deviceList, setDeviceList] = useState([])
  const [status, setStatus] = useState("initialising")
  const [recorder, setRecorder] = useState(null) // a MediaRecorder() instance

  const data = [] // Raw data from the MediaRecorder() gets dumped here

  // Query the input devices available to the user's browser
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices.forEach((device) => {
        if (device.kind === "audioinput") {
          setDeviceList((oldList) => [...oldList, device])
        }
      })
    })
  }, [])

  // On mount, instantiate a MediaRecorder() object, available as `recorder`.
  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function onSuccess(stream) {
          setRecorder(new MediaRecorder(stream))
        })
        .catch(function onError(error) {
          setStatus(`ERROR: ${error.message}`)
          console.log(error.message)
        })
    } else {
      setStatus(`UNAVAILABLE: getUserMedia is not supported`)
    }
  }, [])

  useEffect(() => {
    if (recorder) {
      visualise()

      /* `dataavailable` is an event that fires periodically each time 
        `timeslice` milliseconds of media have been recorded (or when the 
        entire media has been recorded, if `timeslice` wasn't specified). 
        The event, of type `BlobEvent`, contains the recorded media in 
        its `data` property. (see https://developer.mozilla.org/en-US/docs/Web/API/BlobEvent) */
      recorder.ondataavailable = (e) => {
        data.push(e.data)
      }

      recorder.onerror = (e) => {
        // The error object fired here seems to be deprecated...?
        setStatus(`ERROR: ${e}`)
        throw e.error || new Error(e.name) // e.name is FF non-spec
      }

      recorder.onstart = (e) => {
        setStatus("recording")
      }

      recorder.onpause = (e) => {
        setStatus("paused")
      }

      recorder.onresume = (e) => {
        setStatus("recording")
      }

      recorder.onstop = (e) => {
        setStatus("stopped")
        const newRecording = {}
        newRecording.audioBlob = new Blob(data)
        newRecording.url = window.URL.createObjectURL(newRecording.audioBlob)
        newRecording.date = DateTime.now() // DateTime() object
        setRecordings((existingRecordings) => [
          newRecording,
          ...existingRecordings,
        ])
        data.length = 0
      }

      setStatus("ready")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder])

  const visualise = () => {
    // do something pretty with `recorder.stream`
    console.log(`VISUALISE:`, recorder.stream)
  }

  return (
    <div className="TuneRecorder d-flex flex-column w-50 m-auto mb-5 p-3">
      <div className="tunerecorder-header">
        <h2>Tune Recorder</h2>
      </div>

      <select className="tunerecorder-inputdevicelist">
        {deviceList.map((device, idx) => {
          return (
            <option key={idx} value={device.deviceId}>
              [{idx}] {device.label}
            </option>
          )
        })}
      </select>

      <div className="tunerecorder-status">Status: {status}</div>
      {recorder ? (
        <div className="tunerecorder-controls">
          <div className="tunerecorder-state">{recorder.state}</div>

          <button
            className="tunerecorder-button start-button btn"
            onClick={() => recorder.start()}
          >
            start
          </button>

          <button
            className="tunerecorder-button stop-button btn"
            onClick={() => recorder.stop()}
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

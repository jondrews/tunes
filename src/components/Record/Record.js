import { useReactMediaRecorder } from "react-media-recorder"
import Recording from "./Recording"
import "./Record.css"

export default function Record({ recordings, setRecordings }) {
  const recordingFinished = (blobUrl, blob) => {
    console.log(`Recording stopped! Blob URL is ${blobUrl}:`, blob)
    setRecordings((oldRecordings) => [
      {
        url: blobUrl,
        date: Date.now(),
      },
      ...oldRecordings,
    ])
  }

  const {
    status,
    startRecording,
    stopRecording,
    // mediaBlobUrl,
    // previewAudioStream,
  } = useReactMediaRecorder({
    video: false,
    audio: { autoGainControl: false },
    blobPropertyBag: { type: "audio/mp3" },
    onStop: recordingFinished,
  })

  return (
    <div className="Record">
      <div className="media-player">
        {/* <div className="media-player-visualiser">
          <audio src={mediaBlobUrl} controls autoPlay />
        </div> */}
        <div className="media-player-controls">
          {/* STATUS includes: idle, acquiring_media, recording, stopping, stopped */}
          <p>{status}</p>
          <button onClick={startRecording}>Start Recording</button>
          <button onClick={stopRecording}>Stop Recording</button>
        </div>
      </div>

      <div className="recordings-container">
        <div className="recordings-header">
          <h2>My recordings: ({recordings.length})</h2>
        </div>
        <div className="recordings-list d-flex flex-column">
            {recordings.map((recording) => {
              return(<Recording recording={recording} key={recording.date} />)
            })}
        </div>
      </div>
    </div>
  )
}

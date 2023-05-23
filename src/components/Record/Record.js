import TuneRecorder from "./TuneRecorder"
// import TuneRecording from "./TuneRecording"
import "./Record.css"

export default function Record({ recordings, setRecordings }) {
  // const recordingFinished = (blobUrl, blob) => {
  //   console.log(`Recording stopped! Blob URL is ${blobUrl}:`, blob)
  //   setRecordings((oldRecordings) => [
  //     {
  //       url: blobUrl,
  //       date: Date.now(),
  //     },
  //     ...oldRecordings,
  //   ])
  // }

  // const {
  //   status,
  //   startRecording,
  //   stopRecording,
  //   // mediaBlobUrl,
  //   // previewAudioStream,
  // } = useReactMediaRecorder({
  //   video: false,
  //   audio: { autoGainControl: false },
  //   blobPropertyBag: { type: "audio/mp3" },
  //   onStop: recordingFinished,
  // })

  return (
    // How to record a MediaStream:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery#mediastream_recording

    <div className="Record">
      Record
      <div className="TuneRecorder-container">
        <TuneRecorder />
      </div>

      {/* <div className="recordings-container">
        <div className="recordings-header">
          <h2>My recordings: ({recordings.length})</h2>
        </div>
        <div className="recordings-list d-flex flex-column">
            {recordings.map((recording) => {
              return(<Recording recording={recording} key={recording.date} />)
            })}
        </div>
      </div> */}
    </div>
  )
}

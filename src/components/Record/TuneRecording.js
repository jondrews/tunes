import moment from "moment"
import "./TuneRecording.css"

export default function TuneRecording({ recording }) {
  return (
    // How to build an audio player:
    // https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics
    
    <div className="recording-item d-flex flex-column mb-3">
      {moment(recording.date).fromNow()}:
      <audio src={recording.url} controls />
    </div>
  )
}

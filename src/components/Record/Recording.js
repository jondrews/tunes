import moment from "moment"
import "./Recording.css"

export default function Recording({ recording }) {
  return (
    <div className="recording-item d-flex flex-column mb-3">
      {moment(recording.date).fromNow()}:
      <audio src={recording.url} controls />
    </div>
  )
}

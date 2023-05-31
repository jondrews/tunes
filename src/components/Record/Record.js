import TuneRecorder from "./TuneRecorder"
import TuneRecording from "./TuneRecording"
import "./Record.css"

export default function Record({ recordings, setRecordings }) {
  // const [recordingsDir, setRecordingsDir] = useState(null)

  // const supportsHandleSelectDirectory = () => {
  //   return typeof(window.showDirectoryPicker)!="undefined"
  // }

  // const handleSelectDirectory = () => {
  //   window.showDirectoryPicker().then((dirHandle) => {
  //     console.log("User-selected directory:", dirHandle)
  //   })
  // }

  return (
    <div className="Record">
      <TuneRecorder setRecordings={setRecordings} />

      <div className="recordings-container">
        {/* <div className="recordings-select-directory-container">
          <div>
            {recordingsDir
              ? "My recordings are stored here:"
              : "Select where to find and store your recordings:"}
          </div>
          <div className="directory-selection d-flex">
            <div className="selected-directory">
              {recordingsDir && recordingsDir}
            </div>

            <div>{supportsHandleSelectDirectory() ? "handleSelectDirectory is SUPPORTED" : "handleSelectDirectory NOT SUPPORTED"} </div>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleSelectDirectory()}
            >
              {recordingsDir ? "CHANGE" : "SELECT A DIRECTORY"}
            </button>

            <div className="select-directory-input">
              <label htmlFor="directory-input">Select Directory</label>
              <input
                id="directory-input"
                type="file"
                webkitdirectory="true"
                directory="true"
                onChange={handleSelectDirectory}
              />
            </div>
          </div>
        </div> */}

        <div className="recordings-list d-flex flex-column">
          {recordings.map((recording, idx) => {
            return (
              <TuneRecording
                recording={recording}
                key={`${recording.date.toMillis()}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

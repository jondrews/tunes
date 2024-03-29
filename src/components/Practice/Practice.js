import pluralize from "pluralize"
import { DateTime } from "luxon"
import "./Practice.css"
import PracticeTime from "../PracticeTime/PracticeTime"
import { useEffect, useState } from "react"
import getTune from "../../helpers/getTune"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import { grey } from "@mui/material/colors"

export default function Practice({
  practiceDiary,
  setPracticeDiary,
  userPrefs,
  setUserPrefs,
}) {
  return (
    <div className="Practice">
      <div className="practice-wishlist d-flex flex-column">
        <h3>My practice wishlist:</h3>
        <ul className="pactice-wishlist-list">
          {practiceDiary.getWishlist().tunes.map((tune, idx) => (
            <WishlistItem tune={tune} key={`wishlist-${idx}`} />
          ))}
        </ul>
      </div>

      <div className="practice-diary">
        <h3>My practice diary:</h3>
        {practiceDiary.loaded &&
          practiceDiary.entries.map((practiceSession, idx) => (
            <div key={`session-${idx}`}>
              {/* TODO: Try checking for setId in the practiceSession object
                and bypassing the .map method if it's not defined.          */}
              {practiceSession.tunes.map((tune, idx) => (
                <div
                  key={`tune-${idx}`}
                >
                  {pluralize("Tune", practiceSession.tunes.length)}{" "}
                  {tune.tuneId}, Setting {tune.settingId}
                  {practiceDiary.tuneHasBeenPracticed(tune.tuneId)
                    ? " (has been practiced) "
                    : " (never practiced) "}
                </div>
              ))}
            </div>
          ))}
      </div>

      <div className="PracticeTime">
        <h3>Let's practice!</h3>
        <PracticeTime />
      </div>
    </div>
  )
}

const WishlistItem = (props) => {
  const [tuneObject, setTuneObject] = useState(null)
  const id = props.tune.tunes[0].tuneId

  useEffect(() => {
    getTune(id)
      .then((data) => setTuneObject(data))
      .catch((error) =>
        console.log("Error looking up tune details for WishlistItem:", error)
      )
  }, [id])

  return tuneObject ? (
    <li className="pactice-wishlist-item">
      <MusicNoteIcon fontSize="small" sx={{ color: grey[700] }} />
      {tuneObject.name} ({id}) added{" "}
      {DateTime.fromISO(props.tune.date).toRelative()}
    </li>
  ) : (
    <li>Loading...</li>
  )
}

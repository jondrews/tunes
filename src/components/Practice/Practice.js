import pluralize from "pluralize"
import "./Practice.css"
import PracticeTime from "../PracticeTime/PracticeTime"

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
        {practiceDiary.getWishlist().tunes.map((tune) => (
          <WishlistItem tune={tune} key={`wishlist-${tune.date}`} />
        ))}
      </div>

      <div className="practice-diary">
        <h3>My practice diary:</h3>
        {practiceDiary.loaded &&
          practiceDiary.entries.map((practiceSession) => (
            <div key={practiceSession.date}>
              {/* TODO: Try checking for setId in the practiceSession object
                and bypassing the .map method if it's not defined.          */}
              {practiceSession.tunes.map((tune) => (
                <div
                  key={`${practiceSession.date} + ${tune.tuneId} + ${tune.settingId}`}
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
  const id = props.tune.tunes[0].tuneId
  const elapsed = Date.now() - props.tune.date

  return (
    <div className="practice-wishlist-item d-flex">
      {id} added {elapsed} ago.
    </div>
  )
}

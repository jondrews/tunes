import { useParams, Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { DateTime } from "luxon"
import abcjs from "abcjs"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
// import MenuBookIcon from "@mui/icons-material/MenuBook"

import parseABC from "../../helpers/parseABC"
import "./TuneNotation.css"
import types from "../../types.js"
import getTune from "../../helpers/getTune"

export default function TuneNotation({
  practiceDiary,
  preferredSettings,
  managePreferredSettings,
}) {
  let params = useParams()
  const pageRoute = useLocation().pathname

  const [tuneObject, setTuneObject] = useState()
  const [commentsByAuthorOnly, setCommentsByAuthorOnly] = useState(true)
  const [tuneSetting, setTuneSetting] = useState(0)
  const [dimensions, setDimensions] = useState({
    height: 750,
    width: 750,
  })

  const notation = document.getElementById("notation")

  const openFullscreen = () => {
    if (notation.requestFullscreen) {
      notation.requestFullscreen()
    } else if (notation.webkitRequestFullscreen) {
      /* Safari */
      notation.webkitRequestFullscreen()
    } else if (notation.msRequestFullscreen) {
      /* IE11 */
      notation.msRequestFullscreen()
    }
  }

  const handleResize = () => {
    setDimensions({
      height: document.getElementById("notation")
        ? document.getElementById("notation").clientHeight
        : 750,
      width: document.getElementById("notation")
        ? document.getElementById("notation").clientWidth
        : 750,
    })
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()
    if (params.tuneId) {
      // check if user has a preferred setting for this tune
      setTuneSetting(preferredSettings[params.tuneId] || 0)
      getTune(params.tuneId).then((data) => {
        setTuneObject(data)
        console.log(`tuneObject for tune ${params.tuneId}:`, data)
      })
    }
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [params.tuneId, preferredSettings])

  useEffect(() => {
    if (tuneObject) {
      let abc = parseABC(tuneObject.settings[tuneSetting].abc)
      console.log(
        `abc notation for tune ${tuneObject.id} setting ${tuneSetting}:\n`,
        abc
      )
      abcjs.renderAbc(
        "notation",
        `X:1\nT:${tuneObject.name}\nM:${types[tuneObject.type]}\nK:${
          tuneObject.settings[tuneSetting].key
        }\n${abc}\n`,
        {
          staffwidth: dimensions.width * 0.9,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.6,
            preferredMeasuresPerLine: Math.round(dimensions.width / 200),
          },
        }
      )
    }
  }, [dimensions, tuneSetting, tuneObject])

  return params.tuneId ? (
    <div className="TuneNotation flex-fill">
      {tuneObject && tuneObject.settings && (
        <div className="settings-select-container">
          {tuneObject.settings.length > 1 && (
            <div className="settings-select-action">
              <button
                className="settings-select-button"
                onClick={() =>
                  setTuneSetting(
                    tuneSetting > 0
                      ? tuneSetting - 1
                      : tuneObject.settings.length - 1
                  )
                }
              >
                <ChevronLeftIcon />
              </button>
              <p className="settings-select-text">
                Setting #{tuneSetting + 1} of {tuneObject.settings.length}
              </p>
              <button
                className="settings-select-button"
                onClick={() =>
                  setTuneSetting(
                    tuneSetting < tuneObject.settings.length - 1
                      ? tuneSetting + 1
                      : 0
                  )
                }
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
          <div className="setting-author">
            Setting by:{" "}
            <a
              href={
                tuneObject.settings[tuneSetting].member
                  ? tuneObject.settings[tuneSetting].member.url
                  : "Unknown author"
              }
              target="_blank"
              rel="noreferrer"
              className="thesession-member-link"
            >
              {tuneObject.settings[tuneSetting].member
                ? tuneObject.settings[tuneSetting].member.name
                : "Unknown author"}
            </a>
          </div>
          {preferredSettings[params.tuneId] === tuneSetting ? (
            <div className="setting-preference">
              <span>This is your preferred setting </span>
              <button
                size="sm"
                className="preferred-setting btn btn-sm btn-outline-secondary"
                onClick={() => {
                  managePreferredSettings("remove", tuneObject.id)
                  setTuneSetting(tuneSetting)
                }}
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="setting-preference">
              <button
                size="sm"
                className="preferred-setting btn btn-sm btn-outline-secondary"
                onClick={() => {
                  managePreferredSettings("set", tuneObject.id, tuneSetting)
                  setTuneSetting(tuneSetting)
                }}
              >
                Set as preferred setting
              </button>
            </div>
          )}
        </div>
      )}

      <div className="notation" id="notation"></div>

      <div className="notation-actions">
        {tuneObject &&
          (practiceDiary.containsTune(tuneObject.id) ? (
            <button
              className="practice-now btn btn-outline-danger"
              onClick={() => {
                // TODO: Navigate to Practice page for this tune setting
              }}
            >
              Practice this tune now
            </button>
          ) : (
            <button
              className="add-to-practiceDiary btn btn-outline-danger"
              onClick={() => {
                practiceDiary.add({
                  tunes: [{ tuneId: tuneObject.id, settingId: tuneSetting }],
                })
              }}
            >
              Add to my practice list
            </button>
          ))}
        {tuneObject && (
          <button className="open-fullscreen" onClick={() => openFullscreen()}>
            Fullscreen
          </button>
        )}
      </div>

      {tuneObject && tuneObject.comments && (
        <div className="tune-comments-list d-flex flex-column">
          <div className="tune-comments-header d-flex align-items-baseline">
            <h6 className="m-3">
              {commentsByAuthorOnly
                ? `Comments by ${
                    tuneObject.settings[tuneSetting].member
                      ? tuneObject.settings[tuneSetting].member.name
                      : "Unknown author"
                  }: `
                : "All comments"}
            </h6>
            <button
              className="btn btn-sm btn-outline-secondary p-0"
              onClick={() => {
                setCommentsByAuthorOnly(!commentsByAuthorOnly)
              }}
            >
              {commentsByAuthorOnly
                ? "show all comments"
                : `comments by ${
                    tuneObject.settings[tuneSetting].member
                      ? tuneObject.settings[tuneSetting].member.name
                      : "Unknown author"
                  }`}
            </button>
          </div>

          {commentsByAuthorOnly
            ? tuneObject.comments.map(
                (comment) =>
                  comment.member.id ===
                    tuneObject.settings[tuneSetting].member.id && (
                    <TuneComment
                      comment={comment}
                      key={`comment-${comment.id}`}
                    />
                  )
              )
            : tuneObject.comments.map((comment) => (
                <TuneComment comment={comment} key={`comment-${comment.id}`} />
              ))}
        </div> /* tune comments */
      )}
    </div>
  ) : params.setId ? (
    // :setId provided, but no :tuneId
    <div className="no-tune-selected">
      <h2>No tune selected</h2>
      {pageRoute === "/tune" && (
        <p>
          Head to the <Link to="/">homepage</Link> to find one
        </p>
      )}
      {pageRoute === "/tunebook" && <p>Select a tune from your tunebook</p>}
    </div>
  ) : (
    // No :tuneId, no :setId
    <div className="no-tune-selected">
      <h2>No tune selected</h2>
      {pageRoute === "/tune" && (
        <p>
          Head to the <Link to="/">homepage</Link> to find one
        </p>
      )}
      {pageRoute === "/tunebook" && <p>Select a tune from your tunebook</p>}
    </div>
  )
}

const TuneComment = ({ comment }) => {
  const commentDate = DateTime.fromSQL(comment.date)

  return (
    <div className="TuneComment d-flex align-items-center">
      <div className="author-info d-flex flex-column m-3">
        <a
          className="comment-author"
          href={comment.member ? comment.member.url : ""}
          target="_blank"
          rel="noreferrer"
        >
          {comment.member ? comment.member.name : "Unknown author"}
        </a>
        <div className="comment-age d-flex flex-nowrap flex-shrink-0">
          {/* TODO: Convert this date string to a luxon DateTime.toRelative() */}
          {commentDate.toRelative()}
        </div>
      </div>

      <p className="content">
        <code>{comment.content}</code>
      </p>
    </div>
  )
}

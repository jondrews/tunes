import React from "react"
import { useParams } from "react-router-dom"
import "./PracticeTime.css"

export default function PracticeTime() {
  let params = useParams()

  if (Number(params.tuneId) || Number(params.setId)) {
    return (
      <div>
        PracticeTime -{" "}
        {params.tuneId ? `tune #${params.tuneId}` : `set #${params.setId}`}
      </div>
    )
  }

  return <div>Nothing selected for practice</div>
}

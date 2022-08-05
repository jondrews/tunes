import React from 'react'

export default function TuneBook(props) {
  // console.log('Tunebook:', ...props.tuneBook)
  return (
    <>
      <div>TuneBook</div>
      {props.tuneBook.map((bookEntry) => bookEntry.tuneObject.name).join(', ')}
    </>
  )
}

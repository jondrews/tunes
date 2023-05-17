// export default function getMyTunebook(memberId) {
//   // Returns a user's tunebook from thesession.org, if member number provided.
//   if (memberId) {
//     const thesessionTunebookUrl = `https://thesession.org/members/${memberId}/tunebook?format=json`
//     console.log(`getMyTunebook(${memberId})`)

//     return new Promise((res, rej) => {
//       fetch(thesessionTunebookUrl)
//         .then((response) => response.json())
//         .then((data) => {
//           console.log(`${data.total} tunes in ${memberId}'s tunebook`)
//           res(data)
//         })
//         .catch((error) => {
//           console.log("error fething thesession.org tunebook:", error)
//           rej(error)
//         })
//     })
//   }
// }

export default function getMyTunebook(
  memberId,
  options = { tunes: true, sets: true, offlineMode: false }
) {
  const results = {}

  if (memberId) {
    // Fetch user's tunebook from thesession.org
    const thesessionTunebookUrl = `https://thesession.org/members/${memberId}/tunebook?format=json`
    console.log(`getMyTunebook(${memberId})`)

    const tunes = new Promise((res, rej) => {
      fetch(thesessionTunebookUrl)
        .then((response) => response.json())
        .then((data) => {
          results["tunes"] = data.tunes
          return data
        })
        .then((data) => {
          console.log(`${data.tunes.length} tunes in ${memberId}'s tunebook`)
          res(data)
        })
        .catch((error) => {
          console.log("error fetching thesession.org tunebook:", error)
          rej(error)
        })
    })

    // Fetch user's tunebook from thesession.org
    const thesessionSetListUrl = `https://thesession.org/members/${memberId}/sets?page=1&perpage=50&format=json`
    const sets = new Promise((res, rej) => {
      fetch(thesessionSetListUrl)
        .then((response) => response.json())
        .then((data) => {
          results["sets"] = data.sets
          return data
        })
        .then((data) => {
          console.log(`${data.sets.length} sets in ${memberId}'s set list`)
          res(data)
        })
        .catch((error) => {
          console.log("error fetching thesession.org setlist:", error)
          rej(error)
        })
    })

    return new Promise((res, rej) => {
      Promise.all([tunes, sets])
        .then((data) => res(results))
        .catch((error) => {
          console.log("ERROR in getMyTunebook:", error)
          rej(error)
        })
    })
  }
}

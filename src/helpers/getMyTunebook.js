export default function getMyTunebook(
  memberId,
  options = { tunes: true, sets: true, offlineMode: false }
) {
  const results = []

  if (memberId) {
    console.log(`getMyTunebook(${memberId})`)

    // Queries the size (in pages) of the user's tunebook on thesession.org
    const getTunebookSize = new Promise((res, rej) => {
      fetch(
        `https://thesession.org/members/${memberId}/tunebook?perpage=100&page=1&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(`getTunebookSize(): tunebook has ${data.pages} pages`)
          res(data.pages)
        })
        .catch((error) => {
          console.log(
            `ERROR in getMyTunebook(${memberId})'s getTunebookSize() method`,
            error
          )
        })
    })

    // Queries the size (in pages) of the user's setlist on thesession.org
    const getSetlistSize = new Promise((res, rej) => {
      fetch(
        `https://thesession.org/members/${memberId}/sets?page=1&perpage=50&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(`getSetlistSize(): setlist has ${data.pages} pages`)
          res(data.pages)
        })
        .catch((error) => {
          console.log(
            `ERROR in getMyTunebook(${memberId})'s getSetlistSize() method`,
            error
          )
        })
    })

    /* Fetches a single page of the user's tunebook from thesession.org, then
       pushes the 'tunes' array from the returned object into {results.tunes} */
    const addTunebookPageToResults = (page) => {
      return new Promise((res, rej) => {
        const thesessionTunebookUrl = `https://thesession.org/members/${memberId}/tunebook?perpage=100&page=${page}&format=json`
        fetch(thesessionTunebookUrl)
          .then((response) => response.json())
          .then((data) => {
            data.tunes.forEach((tune) => {
              tune["type"] = "tune"
              results.push(tune)
            })
            res(true)
          })
          .catch((error) => {
            console.log(`ERROR in addTunebookPageToResults(${page})`)
            rej(error)
          })
      })
    }

    /* Fetches a single page of the user's setlist from thesession.org, then
       pushes the 'sets' array from the returned object into {results.sets} */
    const addSetlistPageToResults = (page) => {
      return new Promise((res, rej) => {
        const thesessionSetlistUrl = `https://thesession.org/members/${memberId}/sets?page=${page}&perpage=50&format=json`
        fetch(thesessionSetlistUrl)
          .then((response) => response.json())
          .then((data) => {
            data.sets.forEach((set) => {
              set["type"] = "set"
              results.push(set)
            })
            res(true)
          })
          .catch((error) => {
            console.log(`ERROR in addSetlistPageToResults(${page})`)
            rej(error)
          })
      })
    }

    /* Adds one page after another of user's tunebook to the results.tunes 
         array. Resolves once all the pages' promises have resolved. */
    const compileTunes = new Promise((res, rej) => {
      getTunebookSize.then((tunebookSize) => {
        Promise.all(
          Array.from(Array(tunebookSize), (_, idx) =>
            addTunebookPageToResults(idx + 1)
          )
        )
          .then((responses) => {
            console.log("PROMISE.ALL responses:", responses)
            return responses
          })
          .then((_) => res(results))
          .catch((error) => {
            console.log("ERROR in getMyTunebook()'s tunes() method:", error)
            rej(error)
          })
      })
    })

    /* Adds one page after another of user's tunebook to the results.tunes 
         array. Resolves once all the pages' promises have resolved. */
    const compileSets = new Promise((res, rej) => {
      getSetlistSize.then((setlistSize) => {
        Promise.all(
          Array.from(Array(setlistSize), (_, idx) =>
            addSetlistPageToResults(idx + 1)
          )
        )
          .then((_) => res(results))
          .catch((error) => {
            console.log("ERROR in getMyTunebook()'s sets() method:", error)
            rej(error)
          })
      })
    })

    return new Promise((res, rej) => {
      Promise.all([compileTunes, compileSets])
        .then((_) => res(results))
        .catch((error) => {
          console.log("ERROR in getMyTunebook()'s Promise.all() method:", error)
          rej(error)
        })
    })
  }
}

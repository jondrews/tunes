export default function getTune(id) {
  const callAPI = (id) => {
    const url = `https://thesession.org/tunes/${id}?format=json`
    return new Promise((res, rej) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(`getTune(${id}): data from thesession.org`, data)
          // Add this tune to the cache
          console.log(`getTune(${id}): adding to sessionStorage`, data)
          sessionStorage.setItem(`${id}cache`, JSON.stringify(data))
          res(data)
        })
        .catch((error) => {
          console.log(`ERROR in getTune(${id}):`, error)
          rej(error)
        })
    })
  }

  if (id) {
    // Resolves with a tune object if found in sessionStorage, null if not.
    console.log(`getTune(${id}): looking in sessionStorage`)
    return new Promise((res, rej) => {
      if (sessionStorage.getItem(`${id}cache`)) {
        console.log(`getTune(${id}): FOUND in sessionStorage!`)
        res(JSON.parse(sessionStorage.getItem(`${id}cache`)))
      } else {
        console.log(`getTune(${id}): not found in sessionStorage`)
        res(callAPI(id))
      }
    })
  }
}

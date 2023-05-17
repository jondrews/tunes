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
          sessionStorage.setItem(`tune${id}`, JSON.stringify(data))
          res(data)
        })
        .catch((error) => {
          console.log(`ERROR in getTune(${id}):`, error)
          rej(error)
        })
    })
  }

  if (id) {
    // Resolves with a tune object
    return new Promise((res, rej) => {
      // Check if we've stored this tune in sessionStorage first
      if (sessionStorage.getItem(`tune${id}`)) {
        console.log(`getTune(${id}): FOUND in cache!`)
        res(JSON.parse(sessionStorage.getItem(`tune${id}`)))
      } else {
        console.log(`getTune(${id}): not cached`)
        res(callAPI(id))
      }
    })
  } else {
    console.log(`getTune() ERROR: no tune id`)
    return new Promise((res, rej) => res(null))
  }
}

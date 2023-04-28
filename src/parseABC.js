export default function parseABC(abc) {
  abc = abc.replace(/\|!/g, "|") // remove thesession.org's custom pagination (exclamation marks)
  abc = abc.replace(/:\| \|:/g, ":||:") // remove double barline spaces
  abc = abc.replace(/(K:[a-zA-Z\s]*)!/g, "[$1]") // deal with inline key signature changes
  return abc
}
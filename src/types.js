const types = [
  "jig",
  "reel",
  "slip jig",
  "hornpipe",
  "polka",
  "slide",
  "waltz",
  "barndance",
  "strathspey",
  "three-two",
  "mazurka",
  "march",
]

// NOTE for parsing time signatures:
// Barndance, Reel, Hornpipe, Strathspey	4/4
// Jig	6/8
// Waltz, Mazurka	3/4
// Polka	2/4
// Slide	12/8
// Slip jig	9/8
// Three-two	3/2
// The default note length in each case is 1/8.

export default types
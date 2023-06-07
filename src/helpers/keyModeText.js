// Returns a prettier key+mode display (eg, "Adorian" returns "A dorian")
export default function keyModeText(k) {
  return k.replace(/([A-Ga-g][b♭#♯]{0,2})(\s*)([A-Za-z]*)/, "$1 $3")
}

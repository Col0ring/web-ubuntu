const brightnessKey = 'web-ubuntu-brightness-key'
const soundKey = 'web-ubuntu-sound-key'

export function setBrightness(brightness: number) {
  localStorage.setItem(brightnessKey, `${brightness}`)
}

export function getBrightness() {
  return +(localStorage.getItem(brightnessKey) || 100)
}

export function setSound(sound: number) {
  localStorage.setItem(soundKey, `${sound}`)
}

export function getSound() {
  return +(localStorage.getItem(soundKey) || 100)
}

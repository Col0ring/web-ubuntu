const brightnessKey = 'web-ubuntu-auth-key'

export function setBrightness(token: string) {
  localStorage.setItem(brightnessKey, token)
}

export function getBrightness() {
  return +(localStorage.getItem(brightnessKey) || 100)
}

export function removeBrightness() {
  localStorage.removeItem(brightnessKey)
}

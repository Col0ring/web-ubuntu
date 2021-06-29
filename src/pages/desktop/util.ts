const backgroundImageKey = 'web-ubuntu-brightness-key'

export function setBackgroundImage(backgroundImage: string) {
  localStorage.setItem(backgroundImageKey, backgroundImage)
}

export function getBackgroundImage() {
  return localStorage.getItem(backgroundImageKey)
}

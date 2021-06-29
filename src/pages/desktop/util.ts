const backgroundImageKey = 'web-ubuntu-background-key'

export function setBackgroundImage(backgroundImage: string) {
  localStorage.setItem(backgroundImageKey, backgroundImage)
}

export function getBackgroundImage() {
  return localStorage.getItem(backgroundImageKey)
}

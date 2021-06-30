import { createLocalStorage } from '@/utils/local-storage'

const { setBrightness, getBrightness } = createLocalStorage('brightness', {
  defaultValue: 100,
  map(v) {
    if (typeof v === 'string') {
      return +v
    }
    return 0
  }
})
const { setSound, getSound } = createLocalStorage('sound', {
  defaultValue: 100,
  map(v) {
    if (typeof v === 'string') {
      return +v
    }
    return 0
  }
})

export { setBrightness, getBrightness, setSound, getSound }

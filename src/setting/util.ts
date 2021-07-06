import { createLocalStorage } from '@/utils/local-storage'

const { setBrightness, getBrightness } = createLocalStorage('brightness', {
  defaultValue: 100,
  map(v) {
    if (typeof v === 'string') {
      return +v
    }
    return 100
  },
})
const { setSound, getSound } = createLocalStorage('sound', {
  defaultValue: 100,
  map(v) {
    if (typeof v === 'string') {
      return +v
    }
    return 100
  },
})

export { setBrightness, getBrightness, setSound, getSound }

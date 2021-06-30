import { createLocalStorage } from '@/utils/local-storage'

const { setBrightness, getBrightness } = createLocalStorage('brightness')
const { setSound, getSound } = createLocalStorage('sound')

export { setBrightness, getBrightness, setSound, getSound }

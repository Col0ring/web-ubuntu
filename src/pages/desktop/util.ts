import { createLocalStorage } from '@/utils/local-storage'
const { setBackgroundImage, getBackgroundImage } =
  createLocalStorage('backgroundImage')
export { setBackgroundImage, getBackgroundImage }

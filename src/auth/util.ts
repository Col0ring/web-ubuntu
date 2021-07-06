import { createLocalStorage } from '@/utils/local-storage'

const { setToken, getToken, removeToken } = createLocalStorage('token')
export { setToken, getToken, removeToken }

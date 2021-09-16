import { base } from '../config'

const isAbsolute = (path: string) => !path.startsWith('.')

export function addBase(url: string) {
  return isAbsolute(url)
    ? `/${`${base}${url}`.split('/').filter(Boolean).join('/')}`
    : url
}

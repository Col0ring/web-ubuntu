import { useCacheContext } from './provider'

export function useKeepAlive() {
  const [, { clear }] = useCacheContext()
  return { clear }
}

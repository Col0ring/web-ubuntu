import { useEffect } from 'react'
import { CacheStatus } from './constants'
import { useCacheContext } from './provider'

export function useKeepAlive() {
  const [, { clear, refresh }] = useCacheContext()
  return { clear, refresh }
}

export function useActivateEffect(
  fn: (cacheId: string) => void,
  cacheIds?: string[]
) {
  const [cacheState] = useCacheContext()
  useEffect(() => {
    Object.values(cacheState).forEach(({ status, cacheId }) => {
      if (!cacheIds || cacheIds?.includes(cacheId)) {
        if (status === CacheStatus.ACTIVATED) {
          fn(cacheId)
        }
      }
    })
  }, [cacheState])
}

export function useDeactivateEffect(
  fn: (cacheId: string) => void,
  cacheIds?: string[]
) {
  const [cacheState] = useCacheContext()
  useEffect(() => {
    Object.values(cacheState).forEach(({ status, cacheId }) => {
      if (!cacheIds || cacheIds?.includes(cacheId)) {
        if (status === CacheStatus.DEACTIVATED) {
          fn(cacheId)
        }
      }
    })
  }, [cacheState])
}

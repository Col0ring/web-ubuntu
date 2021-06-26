import React, { useEffect, useRef } from 'react'
import useEventListener from '@/hooks/common/useEventListener'
import { CacheOptions } from './type'
import { useCacheContext } from './provider'
import { CacheStatus } from './constants'
import useUnmount from '@/hooks/common/useUnmount'

export interface KeepAliveProps extends CacheOptions {
  className?: string
  style?: React.CSSProperties
}
const KeepAlive: React.FC<KeepAliveProps> = ({
  children,
  cacheId,
  className,
  style,
  scroll = false
}) => {
  const [cacheState, cacheMethods] = useCacheContext()
  const keepAliveRef = useRef<HTMLDivElement | null>(null)
  useEventListener(keepAliveRef, 'scroll', (e) => {
    cacheMethods.cacheScroll(cacheId, e)
  })
  const cacheElement = cacheState[cacheId]

  useEffect(() => {
    // cache  render
    if (
      cacheElement &&
      cacheElement.doms &&
      cacheElement.status !== CacheStatus.DESTROY
    ) {
      cacheMethods.renderCacheDoms(cacheId, {
        scroll,
        parentNode: keepAliveRef.current!
      })
    } else {
      // first render
      cacheMethods.addCacheElement(cacheId, <>{children}</>)
    }
  }, [cacheElement, cacheMethods, cacheId, scroll, children])

  useUnmount(() => {
    cacheMethods.cacheDoms(cacheId)
  })

  return (
    <div
      id={`keepalive-cache-${cacheId}`}
      ref={keepAliveRef}
      className={className}
      style={style}
    />
  )
}

export { KeepAlive }
export default KeepAlive

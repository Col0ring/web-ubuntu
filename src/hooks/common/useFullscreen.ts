import { useCallback, useRef, useState } from 'react'
import screenfull from 'screenfull'
import useUnmount from './useUnmount'

interface UseFullscreenOptions {
  onExitFull?: () => void
  onFull?: () => void
}

function useFullscreen(
  ref: React.RefObject<Element>,
  options: UseFullscreenOptions = {}
) {
  const { onExitFull, onFull } = options

  const onExitFullRef = useRef(onExitFull)
  onExitFullRef.current = onExitFull
  const onFullRef = useRef(onFull)
  onFullRef.current = onFull

  const [state, setState] = useState(false)

  const onChange = useCallback(() => {
    if (screenfull.isEnabled) {
      const { isFullscreen } = screenfull
      if (isFullscreen) {
        onFullRef.current?.()
      } else {
        screenfull.off('change', onChange)
        onExitFullRef.current?.()
      }
      setState(isFullscreen)
    }
  }, [])

  const setFull = useCallback(() => {
    // 有 ref 才全屏
    if (screenfull.isEnabled && ref.current) {
      try {
        screenfull.request(ref.current)
        // 动态订阅事件
        screenfull.on('change', onChange)
      } catch (error) {
        // log
        console.error(error)
      }
    }
  }, [ref, onChange])

  const exitFull = useCallback(() => {
    if (!state) {
      return
    }
    if (screenfull.isEnabled) {
      screenfull.exit()
    }
  }, [state])

  const toggleFull = useCallback(() => {
    if (state) {
      exitFull()
    } else {
      setFull()
    }
  }, [state, setFull, exitFull])

  useUnmount(() => {
    if (screenfull.isEnabled) {
      screenfull.off('change', onChange)
    }
  })

  return [
    state,
    {
      setFull,
      exitFull,
      toggleFull
    }
  ] as const
}

export type { UseFullscreenOptions }
export default useFullscreen

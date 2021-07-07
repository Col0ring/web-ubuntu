import React, { useEffect, useState } from 'react'

// sync import

// eslint-disable-next-line import/newline-after-import
;(async () => {
  if (!window.ResizeObserver) {
    // eslint-disable-next-line require-atomic-updates
    window.ResizeObserver = (await import('resize-observer-polyfill')).default
  }
})()

type UseSizeState = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>

const defaultState: UseSizeState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}
// react-use 有一个使用 iframe 的 hack 版本
function useSize(ref: React.RefObject<Element>): UseSizeState {
  const [state, setState] = useState<UseSizeState>(defaultState)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        const entry = entries[0]
        if (!entry) {
          return
        }
        const { x, y, width, height, top, left, bottom, right } =
          entry.contentRect

        setState({
          x,
          y,
          width,
          height,
          top,
          left,
          bottom,
          right,
        })
      }
    )

    resizeObserver.observe(ref.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return state
}

export type { UseSizeState }
export default useSize

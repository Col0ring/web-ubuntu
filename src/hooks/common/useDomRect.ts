import React, { useEffect, useState } from 'react'

type UseDomRectState = Pick<
  DOMRectReadOnly,
  'x' | 'y' | 'top' | 'left' | 'right' | 'bottom' | 'height' | 'width'
>

const defaultState: UseDomRectState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}

function useDomRect(
  ref: React.RefObject<Element>,
  deps?: React.DependencyList
): UseDomRectState {
  const [state, setState] = useState<UseDomRectState>(defaultState)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const domRect = ref.current.getBoundingClientRect()
    const { x, y, width, height, top, left, bottom, right } = domRect
    setState({
      x,
      y,
      width,
      height,
      top,
      left,
      bottom,
      right
    })
  }, deps)

  return state
}
export type { UseDomRectState }
export default useDomRect

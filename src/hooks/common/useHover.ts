import React, { useState } from 'react'
import { DomElement } from '../../typings/tools'
import useEventListener from './useEventListener'

interface UseHoverOptions {
  onEnter?: () => void
  onLeave?: () => void
}

function useHover(
  ref: React.RefObject<DomElement>,
  options: UseHoverOptions = {}
): boolean {
  const { onEnter, onLeave } = options
  const [isHovering, setIsHovering] = useState(false)

  useEventListener(ref, 'mouseenter', () => {
    onEnter?.()
    setIsHovering(true)
  })

  useEventListener(ref, 'mouseleave', () => {
    onLeave?.()
    setIsHovering(false)
  })

  return isHovering
}
export type { UseHoverOptions }
export default useHover

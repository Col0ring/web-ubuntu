import { useCallback } from 'react'
import useEventListener from './useEventListener'
interface MoveContext {
  left: number
  top: number
  moveX: number
  moveY: number
  offsetX: number
  offsetY: number
  width: number
  height: number
}

interface useDomMoveOptions {
  filterMoving?: (e: MouseEvent) => boolean
  onMoveStart?: (e: MouseEvent) => void
  onMoving?: (context: MoveContext, e: MouseEvent) => void
  onMoveEnd?: (e: MouseEvent) => void
}

function useDomMove(
  ref: React.RefObject<HTMLElement>,
  { filterMoving, onMoveStart, onMoving, onMoveEnd }: useDomMoveOptions = {}
) {
  const onMoveDown = useCallback((e: MouseEvent) => {
    onMoveStart?.(e)
    if (filterMoving && !filterMoving(e)) {
      return
    }

    const {
      width,
      left: rectLeft,
      top: rectTop,
      height
    } = (e.currentTarget as HTMLElement).getBoundingClientRect()

    const downX = e.clientX
    const downY = e.clientY

    const onMuseMove = (e: MouseEvent) => {
      const moveX = e.clientX
      const moveY = e.clientY
      const offsetX = moveX - downX
      const offsetY = moveY - downY
      const left = rectLeft + offsetX
      const top = rectTop + offsetY
      onMoving?.(
        {
          moveX,
          moveY,
          offsetX,
          offsetY,
          left,
          top,
          width,
          height
        },
        e
      )
    }

    const onMouseUp = (e: MouseEvent) => {
      onMoveEnd?.(e)
      document.removeEventListener('mousemove', onMuseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMuseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])
  useEventListener(ref, 'mousedown', onMoveDown)
}

export type { MoveContext, useDomMoveOptions }
export default useDomMove

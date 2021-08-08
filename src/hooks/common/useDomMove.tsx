import { useCallback } from 'react'
import { DomParam } from '@/typings/tools'
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
  ref: DomParam,
  { filterMoving, onMoveStart, onMoving, onMoveEnd }: useDomMoveOptions = {}
) {
  const onMoveDown = useCallback((e: MouseEvent) => {
    if (filterMoving && !filterMoving(e)) {
      return
    }
    onMoveStart?.(e)

    const {
      width,
      left: rectLeft,
      top: rectTop,
      height,
    } = (e.currentTarget as HTMLElement).getBoundingClientRect()

    const downX = e.clientX
    const downY = e.clientY

    const onMuseMove = (ev: MouseEvent) => {
      const moveX = ev.clientX
      const moveY = ev.clientY
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
          height,
        },
        ev
      )
    }

    const onMouseUp = (ev: MouseEvent) => {
      onMoveEnd?.(ev)
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

import React, { useCallback, useEffect, useRef } from 'react'
import classnames from 'classnames'
import useSize from '@/hooks/common/useSize'
import { useDragContext, withDragProvider } from './provider'
import { DragContextValue } from './type'

export interface DragAreaProps {
  limitRange?: DragContextValue['dragArea']['limitRange']
  preventDropAction?: boolean
  onDrop?: (e: React.DragEvent) => void
  className?: string
}
const DragArea: React.FC<DragAreaProps> = ({
  children,
  onDrop,
  limitRange,
  preventDropAction,
  className,
}) => {
  const [, dragMethods] = useDragContext()
  const dragAreaRef = useRef<HTMLDivElement | null>(null)
  const { width, height } = useSize(dragAreaRef)
  const dragAreaClassName = classnames(
    'relative w-full h-full left-0 top-0',
    className
  )
  const onDragAreaDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (preventDropAction) {
        e.preventDefault()
      }
      onDrop?.(e)
    },
    [onDrop]
  )
  useEffect(() => {
    dragMethods.setDragArea({
      width,
      height,
      limitRange: limitRange || {
        x: [0, width],
        y: [0, height],
      },
    })
  }, [width, limitRange, height, dragMethods])
  return (
    <div
      ref={dragAreaRef}
      onDrop={onDragAreaDrop}
      className={dragAreaClassName}
    >
      {children}
    </div>
  )
}

export default withDragProvider(DragArea)

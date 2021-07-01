import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import useDomRect from '@/hooks/common/useDomRect'
import { useDragContext, withDragProvider } from './provider'

export interface DragAreaProps {
  limitRange?: {
    x: [xMin: number, xMax: number]
    y: [yMin: number, yMax: number]
  }
  onDrop?: (e: React.DragEvent) => void
  resizeDeps?: React.DependencyList
  className?: string
}
const DragArea: React.FC<DragAreaProps> = ({
  children,
  onDrop,
  limitRange,
  className,
  resizeDeps
}) => {
  const [, dragMethods] = useDragContext()
  const dragAreaRef = useRef<HTMLDivElement | null>(null)
  const { width, height } = useDomRect(dragAreaRef, resizeDeps || [])
  const dragAreaClassName = classnames(
    'relative w-full t-full left-0 top-0',
    className
  )
  useEffect(() => {
    dragMethods.setDragArea({
      width,
      height
    })
  }, [width, height, dragMethods])
  return (
    <div ref={dragAreaRef} onDrop={onDrop} className={dragAreaClassName}>
      {children}
    </div>
  )
}

export default withDragProvider(DragArea)

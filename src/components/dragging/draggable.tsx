import React, { forwardRef } from 'react'
import useDrag, { UseDragOptions } from '@/hooks/common/useDrag'
import { useDragContext } from './provider'
export interface DraggableProps<T = any> extends UseDragOptions<T> {
  children?: React.ReactNode
  data?: T
  className?: string
  style?: React.CSSProperties
}

const Draggable: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DraggableProps
> = ({ data, children, onDragEnd, onDragStart, className, style }, ref) => {
  const [dragState] = useDragContext()
  const [, getProps] = useDrag({
    onDragStart,
    onDragEnd
  })
  return (
    <div ref={ref} {...getProps(data)} style={style} className={className}>
      {children}
    </div>
  )
}

export default forwardRef(Draggable)

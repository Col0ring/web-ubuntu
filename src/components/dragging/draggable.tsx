import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useDrag, { UseDragOptions } from '@/hooks/common/useDrag'
import { useDragContext } from './provider'
import classnames from 'classnames'
export interface DraggableProps<T = any> extends UseDragOptions<T> {
  children?: React.ReactNode
  data?: T
  className?: string
  style?: React.CSSProperties
  nodeRef?: React.RefObject<HTMLDivElement>
}

const Draggable: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DraggableProps
> = ({ data, children, onDragEnd, onDragStart, className, style, nodeRef }) => {
  const [dragState] = useDragContext()
  const { dragArea } = dragState

  const draggableRef = useRef<HTMLDivElement | null>(null)
  const ref = nodeRef || draggableRef
  const [rect, setRect] = useState({
    width: 0,
    height: 0
  })

  const [position, setPosition] = useState({
    left: 0,
    top: 0
  })

  const [offset, setOffset] = useState({
    left: 0,
    top: 0
  })

  const onStart: Required<DraggableProps>['onDragStart'] = useCallback(
    (data, e) => {
      const target = e.currentTarget as HTMLDivElement
      setOffset({
        left: e.clientX - target.offsetLeft,
        top: e.clientY - target.offsetTop
      })
      onDragStart?.(data, e)
    },
    [onDragStart, setOffset]
  )
  const onEnd: Required<DraggableProps>['onDragEnd'] = useCallback(
    (data, e) => {
      let left = e.clientX - offset.left
      let top = e.clientY - offset.top

      const { x, y } = dragArea.limitRange

      if (left < x[0]) {
        left = 0
      }

      if (left > x[1] - rect.width) {
        left = x[1] - rect.width
      }

      if (top > y[1] - rect.height) {
        top = y[1] - rect.height
      }

      if (top < y[0]) {
        top = y[0]
      }
      setPosition({
        left,
        top
      })
      onDragEnd?.(data, e)
    },
    [onDragEnd, setPosition, offset, dragArea.limitRange]
  )
  const [, getProps] = useDrag({
    onDragStart: onStart,
    onDragEnd: onEnd
  })
  const draggableClassName = classnames(className, 'absolute')

  const draggableStyle = useMemo(() => {
    const { x, y } = dragArea.limitRange
    return {
      ...style,
      left:
        typeof position.left === 'string'
          ? position.left
          : (position.left / x[1]) * 100 + '%',
      top:
        typeof position.top === 'string'
          ? position.top
          : (position.top / y[1]) * 100 + '%'
    }
  }, [style, position, dragArea.limitRange])

  useEffect(() => {
    if (ref.current) {
      const domRect = ref.current.getBoundingClientRect()
      setRect({
        width: domRect.width,
        height: domRect.height
      })
    }
  }, [setRect])

  return (
    <div
      ref={ref}
      {...getProps(data)}
      style={draggableStyle}
      className={draggableClassName}
    >
      {children}
    </div>
  )
}

export default Draggable

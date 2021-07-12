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
  defaultPosition?: {
    left: number
    top: number
  }
}

const Draggable: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DraggableProps
> = ({
  data,
  children,
  onDragEnd,
  onDragStart,
  className,
  style,
  nodeRef,
  defaultPosition,
}) => {
  const [dragState] = useDragContext()
  const { dragArea } = dragState

  const draggableRef = useRef<HTMLDivElement | null>(null)
  const ref = nodeRef || draggableRef
  const [rect, setRect] = useState({
    width: 0,
    height: 0,
  })

  const [position, setPosition] = useState(
    defaultPosition || {
      left: 0,
      top: 0,
    }
  )

  const [offset, setOffset] = useState({
    left: 0,
    top: 0,
  })

  const onStart: Required<DraggableProps>['onDragStart'] = useCallback(
    (dragData, e) => {
      const target = e.currentTarget as HTMLDivElement
      setOffset({
        left: e.clientX - target.offsetLeft,
        top: e.clientY - target.offsetTop,
      })
      onDragStart?.(dragData, e)
    },
    [onDragStart, setOffset]
  )
  const onEnd: Required<DraggableProps>['onDragEnd'] = useCallback(
    (dragData, e) => {
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
        top,
      })
      onDragEnd?.(dragData, e)
    },
    [onDragEnd, setPosition, offset, dragArea.limitRange]
  )
  const [, getProps] = useDrag({
    onDragStart: onStart,
    onDragEnd: onEnd,
  })
  const draggableClassName = classnames(className, 'absolute')

  const draggableStyle = useMemo(() => {
    const { x, y } = dragArea.limitRange
    return {
      left:
        typeof position.left === 'string'
          ? position.left
          : `${(position.left / x[1]) * 100}%`,
      top:
        typeof position.top === 'string'
          ? position.top
          : `${(position.top / y[1]) * 100}%`,
      ...style,
    }
  }, [style, position, dragArea.limitRange])

  useEffect(() => {
    defaultPosition && setPosition(defaultPosition)
  }, [defaultPosition?.top, defaultPosition?.left])

  useEffect(() => {
    if (ref.current) {
      const domRect = ref.current.getBoundingClientRect()
      setRect({
        width: domRect.width,
        height: domRect.height,
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

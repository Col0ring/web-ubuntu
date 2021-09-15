import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useDrag, { UseDragOptions } from '@/hooks/common/useDrag'
import { useDragContext } from './provider'
import classnames from 'classnames'
import { AppPositionValue } from '@/typings/app'

export interface DraggableProps<T = any> extends UseDragOptions<T> {
  children?: React.ReactNode
  data?: T
  className?: string
  style?: React.CSSProperties
  nodeRef?: React.RefObject<HTMLDivElement>
  defaultPosition?: {
    left: AppPositionValue
    top: AppPositionValue
  }
  onPositionChange?: (position: {
    left: AppPositionValue
    top: AppPositionValue
  }) => void
  onValid?: (data: T, e: React.DragEvent) => Promise<boolean> | boolean
}

const Draggable: React.ForwardRefRenderFunction<
  HTMLDivElement,
  DraggableProps
> = ({
  data,
  children,
  onDragEnd,
  onDragStart,
  onDrag,
  onValid,
  className,
  style,
  nodeRef,
  defaultPosition,
  onPositionChange,
}) => {
  const [dragState] = useDragContext()
  const { dragArea } = dragState
  const onPositionChangeRef = useRef(onPositionChange)
  onPositionChangeRef.current = onPositionChange
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const ref = nodeRef || draggableRef

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
    async (dragData, e) => {
      let left = e.clientX - offset.left
      let top = e.clientY - offset.top
      const { x, y } = dragArea.limitRange
      const domRect = ref.current!.getBoundingClientRect()
      const isValid = await onValid?.(dragData, e)
      if (!isValid) {
        return
      }
      if (left < x[0]) {
        left = 0
      }

      if (left > x[1] - domRect.width) {
        left = x[1] - domRect.width
      }

      if (top > y[1] - domRect.height) {
        top = y[1] - domRect.height
      }

      if (top < y[0]) {
        top = y[0]
      }
      setPosition({
        left,
        top,
      })
    },
    [onDragEnd, setPosition, offset, dragArea.limitRange]
  )

  const onMoving: Required<DraggableProps>['onDrag'] = useCallback(
    (dragData, e) => {
      onDrag?.(dragData, e)
    },
    [onDrag, setPosition, offset, dragArea.limitRange]
  )
  const [, getProps] = useDrag({
    onDragStart: onStart,
    onDragEnd: onEnd,
    onDrag: onMoving,
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
    onPositionChangeRef.current?.(position)
  }, [position])

  useEffect(() => {
    defaultPosition && setPosition(defaultPosition)
  }, [defaultPosition?.top, defaultPosition?.left])

  const dragData = useMemo(() => data, [data])

  return (
    <div
      ref={ref}
      {...getProps(dragData)}
      style={draggableStyle}
      className={draggableClassName}
    >
      {children}
    </div>
  )
}

export default Draggable

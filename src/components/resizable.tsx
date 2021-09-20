/* eslint-disable react/prop-types */
import React, { forwardRef, useRef } from 'react'
import classnames from 'classnames'
import useDomMove, { MoveContext } from '@/hooks/common/useDomMove'

const directions = ['t', 'r', 'b', 'l', 'lt', 'lb', 'rb', 'rt'] as const
export type Direction = 'lt' | 't' | 'rt' | 'r' | 'rb' | 'b' | 'lb' | 'l'
export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  style?: React.CSSProperties
  onMoveStart?: (e: MouseEvent) => void
  onMoving?: (direction: Direction, context: MoveContext, e: MouseEvent) => void
  onMoveEnd?: (e: MouseEvent) => void
  children?: React.ReactNode
  disabled?: boolean
}

const directionsClassLit = directions.map((direction) => {
  const hasL = direction.includes('l')
  const hasR = direction.includes('r')
  const hasT = direction.includes('t')
  const hasB = direction.includes('b')
  const directionClassName = classnames('absolute transform z-60 cursor-move', {
    'left-0 -translate-x-1/2': hasL,
    'top-0 -translate-y-1/2': hasT,
    'right-0 translate-x-1/2': hasR,
    'bottom-0 translate-y-1/2': hasB,
    'h-full': direction.length === 1 && (hasL || hasR),
    'h-5': direction.includes('t') || direction.includes('b'),
    'w-full': direction.length === 1 && (hasT || hasB),
    'w-5': direction.includes('l') || direction.includes('r'),
  })
  return {
    className: directionClassName,
    direction,
  }
})

const Resizable: React.ForwardRefRenderFunction<
  HTMLDivElement,
  ResizableProps
> = (
  {
    children,
    className,
    style,
    onMoving,
    onMoveEnd,
    onMoveStart,
    disabled = false,
    ...props
  },
  ref
) => {
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const directionRef = useRef<Direction>()
  const resizableClassName = classnames('relative', className)

  useDomMove((ref as React.RefObject<HTMLDivElement>) || nodeRef, {
    filterMoving: (e) => {
      const target = e.target as HTMLDivElement
      if (
        target.dataset.direction &&
        directions.includes(target.dataset.direction as Direction)
      ) {
        directionRef.current = target.dataset.direction as Direction
        return true
      }
      return false
    },
    onMoveStart,
    onMoving: (ctx, e) => {
      onMoving?.(directionRef.current!, ctx, e)
    },
    onMoveEnd,
  })
  return (
    <div
      ref={ref || nodeRef}
      className={resizableClassName}
      style={style}
      {...props}
    >
      {!disabled &&
        directionsClassLit.map(({ direction, className: itemClassName }) => {
          return (
            <div
              key={direction}
              data-direction={direction}
              className={itemClassName}
            />
          )
        })}
      {children}
    </div>
  )
}

export default forwardRef(Resizable)

import React, { forwardRef, useRef } from 'react'
import useDomMove, { useDomMoveOptions } from '@/hooks/common/useDomMove'

type ExtendsOptions = useDomMoveOptions & React.HTMLAttributes<HTMLDivElement>
export interface MovableProps extends ExtendsOptions {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Movable: React.ForwardRefRenderFunction<HTMLDivElement, MovableProps> = (
  {
    children,
    onMoveStart,
    onMoveEnd,
    onMoving,
    filterMoving,
    className,
    style,
    ...props
  },
  ref
) => {
  const movableRef = useRef<HTMLDivElement | null>(null)
  useDomMove((ref as React.RefObject<HTMLDivElement>) || movableRef, {
    onMoveStart,
    onMoveEnd,
    onMoving,
    filterMoving,
  })
  return (
    <div ref={ref || movableRef} style={style} className={className} {...props}>
      {children}
    </div>
  )
}

export default forwardRef(Movable)

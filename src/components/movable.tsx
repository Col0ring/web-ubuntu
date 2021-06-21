import React, { useRef } from 'react'
import useDomMove, { useDomMoveOptions } from '@/hooks/common/useDomMove'
export interface MovableProps extends useDomMoveOptions {
  className?: string
  style?: React.CSSProperties
}

const Movable: React.FC<MovableProps> = ({
  children,
  onMoveStart,
  onMoveEnd,
  onMoving,
  filterMoving,
  className,
  style
}) => {
  const movableRef = useRef<HTMLDivElement | null>(null)
  useDomMove(movableRef, {
    onMoveStart,
    onMoveEnd,
    onMoving,
    filterMoving
  })
  return (
    <div ref={movableRef} style={style} className={className}>
      {children}
    </div>
  )
}

export default Movable

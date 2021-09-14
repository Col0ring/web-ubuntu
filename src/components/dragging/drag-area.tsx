import React, { useEffect, useRef } from 'react'
import classnames from 'classnames'
import useSize from '@/hooks/common/useSize'
import { useDragContext, withDragProvider } from './provider'
import { DragContextValue } from './type'
import useDrop, { DropAreaOptions } from '@/hooks/common/useDrop'

export interface DragAreaProps extends DropAreaOptions {
  limitRange?: DragContextValue['dragArea']['limitRange']
  className?: string
}
const DragArea: React.FC<DragAreaProps> = ({
  children,
  limitRange,
  className,
  ...props
}) => {
  const [, dragMethods] = useDragContext()
  const dragAreaRef = useRef<HTMLDivElement | null>(null)
  const { width, height } = useSize(dragAreaRef)
  const dragAreaClassName = classnames(
    'relative w-full h-full left-0 top-0',
    className
  )
  const [dropAreaProps] = useDrop(props)

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
    <div ref={dragAreaRef} className={dragAreaClassName} {...dropAreaProps}>
      {children}
    </div>
  )
}

export default withDragProvider(DragArea)

import React, { useRef } from 'react'
import classnames from 'classnames'
import useHover from '@/hooks/common/useHover'
import { Direction } from '@/typings/tools'

export interface TooltipProps {
  className?: string
  title?: string
  direction?: Direction
}

const directions: Record<Required<TooltipProps>['direction'], string> = {
  top: 'mb-1.5 bottom-full left-1/2 transform  -translate-x-1/2',
  bottom: 'mt-1.5 top-full left-1/2 transform  -translate-x-1/2',
  left: 'mr-1.5 top-1/2 transform -translate-y-1/2 right-full',
  right: 'ml-1.5 top-1/2 transform -translate-y-1/2 left-full',
  'top left': 'mb-0.5 right-full mr-0.5 bottom-full',
  'top right': 'mb-0.5 left-full ml-0.5 bottom-full',
  'bottom left': 'mt-0.5 right-full mr-0.5 top-full',
  'bottom right': 'mt-0.5 left-full ml-0.5 top-full',
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  direction = 'right',
  children,
  className,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const isHover = useHover(tooltipRef)
  const tooltipClassName = classnames('relative', className)
  const titleClassName = classnames(
    'whitespace-nowrap py-0.5 px-1.5 absolute  text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md',
    directions[direction]
  )
  return (
    <div ref={tooltipRef} className={tooltipClassName}>
      {children}
      {isHover && <div className={titleClassName}>{title}</div>}
    </div>
  )
}

export default Tooltip

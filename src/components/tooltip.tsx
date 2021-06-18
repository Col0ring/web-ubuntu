import React, { useRef } from 'react'
import classnames from 'classnames'
import useHover from '@/hooks/common/useHover'

type Direction = 'top' | 'left' | 'bottom' | 'right'

export interface TooltipProps {
  className?: string
  title?: string
  direction?:
    | Direction
    | `${Exclude<Direction, 'left' | 'right'>} ${Exclude<
        Direction,
        'top' | 'bottom'
      >}`
}

const directions: Record<Required<TooltipProps>['direction'], string> = {
  top: '',
  bottom: '',
  left: '',
  right: 'top-1.5 left-full',
  'top left': '',
  'top right': '',
  'bottom left': '',
  'bottom right': ''
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  direction = 'right',
  children,
  className
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const isHover = useHover(tooltipRef)
  const tooltipClassName = classnames('relative', className)
  const titleClassName = classnames(
    'whitespace-nowrap py-0.5 px-1.5 absolute  ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md',
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

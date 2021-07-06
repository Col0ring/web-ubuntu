import React from 'react'
import classnames from 'classnames'
import './style.less'

type Direction = 'up' | 'down' | 'left' | 'right'

export interface ArrowProps {
  className?: string
  direction: Direction
  size?: number
  color?: string
}

const direction2Border = {
  up: 'Bottom',
  down: 'Top',
  left: 'Right',
  right: 'Left',
} as const

const Arrow: React.FC<ArrowProps> = ({ direction, className, size, color }) => {
  const arrowClassName = classnames(
    `arrow-custom-${direction} inline-block`,
    className
  )
  return (
    <i
      style={{
        borderWidth: size,
        [`border${direction2Border[direction]}Color`]: color,
      }}
      className={arrowClassName}
    />
  )
}

export default Arrow

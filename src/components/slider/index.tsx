import React from 'react'
import classnames from 'classnames'
import './style.less'
export interface SliderProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  className?: string
  value?: number
  min?: number
  max?: number
  step?: number
}

const Slider: React.FC<SliderProps> = ({ className, ...rest }) => {
  const sliderClassName = classnames('ubuntu-slider', className)
  return <input type="range" {...rest} className={sliderClassName} />
}

export default Slider

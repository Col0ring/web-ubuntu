import React, { useCallback } from 'react'
import classnames from 'classnames'
import './style.less'

export interface SliderProps {
  onChange?: (value: number, e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  value?: number
  min?: number
  max?: number
  step?: number
}

const Slider: React.FC<SliderProps> = ({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange
}) => {
  const sliderClassName = classnames('ubuntu-slider', className)
  const hasDefaultValue = typeof value === 'undefined'
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange?.(+e.target.value, e)
    },
    []
  )

  return (
    <input
      type="range"
      min={`${min}`}
      max={`${max}`}
      step={`${step}`}
      defaultValue={hasDefaultValue ? '0' : undefined}
      value={hasDefaultValue ? undefined : `${value}`}
      onChange={onInputChange}
      className={sliderClassName}
    />
  )
}

export default Slider

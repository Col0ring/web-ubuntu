import React, { useState } from 'react'
import classnames from 'classnames'
import useInterval from '@/hooks/common/useInterval'

export interface DotProps {
  delay?: number
  dotNumber?: number
  className?: string
}

const Dot: React.FC<DotProps> = ({
  children,
  delay = 500,
  dotNumber = 3,
  className,
}) => {
  const [dot, setDot] = useState('')
  useInterval(() => {
    setDot((state) => {
      if (state === '.'.repeat(dotNumber)) {
        return ''
      }
      return `${state}.`
    })
  }, delay)
  const dotClassName = classnames('ml-1', className)
  return (
    <>
      {children}
      <span className={dotClassName}>{dot}</span>
    </>
  )
}
export default Dot

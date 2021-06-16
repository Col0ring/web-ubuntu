import React from 'react'
import classnames from 'classnames'
export interface ClickUnderlineProps {
  className?: string
  color?: string
}

const ClickUnderline: React.FC<ClickUnderlineProps> = ({
  className,
  children,
  color
}) => {
  const clickUnderlineClassName = classnames(
    'pl-2 pr-2 text-xs md:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1',
    className
  )
  return (
    // div can focus if se tabIndex
    <div
      tabIndex={0}
      style={{
        borderColor: color
      }}
      className={clickUnderlineClassName}
    >
      {children}
    </div>
  )
}

export default ClickUnderline

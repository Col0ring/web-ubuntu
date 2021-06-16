import React from 'react'
import Arrow from '@/components/arrow'
import { StatusIcon } from '../../type'
export interface StatusProps {
  icons: StatusIcon[]
}

const Status: React.FC<StatusProps> = ({ icons }) => {
  return (
    <div className="flex justify-center items-center">
      {icons.map(({ name, icon }) => (
        <span className="mx-1.5">
          <img src={icon} alt={name} className="inline" />
        </span>
      ))}
      <span className="mx-1">
        <Arrow direction="down" />
      </span>
    </div>
  )
}

export default Status

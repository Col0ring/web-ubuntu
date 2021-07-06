import React from 'react'
import Arrow from '@/components/arrow'
import { StatusIconConfig } from '../../type'

export interface StatusProps {
  icons: StatusIconConfig[]
}

const Status: React.FC<StatusProps> = ({ icons }) => {
  return (
    <div className="flex justify-center items-center">
      {icons.map(({ name, icon }) => (
        <img className="mx-1.5" key={name} src={icon} alt={name} />
      ))}
      <span className="mx-1">
        <Arrow direction="down" />
      </span>
    </div>
  )
}

export default Status

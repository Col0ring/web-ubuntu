import React from 'react'
import { StatusIcon } from '../../type'

interface StatusProps {
  icons: StatusIcon[]
}

const Status: React.FC<StatusProps> = ({ icons }) => {
  return (
    <div className="flex justify-center items-center">
      {icons.map(({ name, icon }) => (
        <span className="mx-1.5">
          <img src={icon} alt={name} className="inline status-symbol" />
        </span>
      ))}
    </div>
  )
}

export default Status

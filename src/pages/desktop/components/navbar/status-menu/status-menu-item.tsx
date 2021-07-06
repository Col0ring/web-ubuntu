import React from 'react'

export interface StatusMenuItemProps {
  image?: string
  imageAlt?: string
  name?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const StatusMenuItem: React.FC<StatusMenuItemProps> = ({
  children,
  image,
  imageAlt,
  onClick,
  name,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-64 py-1.5 flex items-center justify-center bg-ub-cool-grey hover:bg-ub-warm-grey hover:bg-opacity-20"
    >
      <div className="w-8">
        <img src={image} alt={imageAlt || name} />
      </div>
      {children || (
        <div className="w-2/3 flex items-center justify-between">
          <span>{name}</span>
        </div>
      )}
    </div>
  )
}

export default StatusMenuItem

import React from 'react'

export interface EmptyProps {
  title?: React.ReactNode
  icon?: React.ReactNode
}
const Empty: React.FC<EmptyProps> = ({ title, icon }) => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="w-24">
        {icon ? (
          icon
        ) : (
          <img
            src="./themes/Yaru/status/user-trash-symbolic.svg"
            alt="ubuntu-empty"
          />
        )}
      </div>
      <span className="font-bold mt-4 text-xl px-1 text-gray-400">{title}</span>
    </div>
  )
}

export default Empty

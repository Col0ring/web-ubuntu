import { addBase } from '@/utils/prod'
import React from 'react'

export interface EmptyProps {
  title?: React.ReactNode
  icon?: React.ReactNode
  img?: string
}
const Empty: React.FC<EmptyProps> = ({ title, icon, img }) => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center h-full w-full">
      <div className="w-24">
        {icon || (
          <img
            className="w-full"
            src={img || addBase('/themes/Yaru/status/empty-folder.svg')}
            alt="ubuntu-empty"
          />
        )}
      </div>
      <span className="font-bold mt-4 text-xl px-1 text-gray-400">{title}</span>
    </div>
  )
}

export default Empty

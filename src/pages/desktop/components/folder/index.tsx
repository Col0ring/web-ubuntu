import React from 'react'
import Empty, { EmptyProps } from './empty'
import FolderApp from './folder-app'
import { DesktopAppConfig } from '@/typings/app'

export interface FolderProps {
  apps: DesktopAppConfig[]
  emptyProps?: EmptyProps
}
const Folder: React.FC<FolderProps> = ({ apps, emptyProps }) => {
  return (
    <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
      {apps.length > 0 ? (
        <div className="flex-grow ml-4 flex flex-wrap items-start content-start justify-start">
          {apps.map((app) => (
            <FolderApp app={app} key={app.id} />
          ))}
        </div>
      ) : (
        <Empty title="Folder is Empty" {...emptyProps} />
      )}
    </div>
  )
}

export default Folder

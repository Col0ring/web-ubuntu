import React from 'react'
import Empty, { EmptyProps } from './empty'
import FolderApp from './folder-app'
import { DragArea, Draggable } from '@/components/dragging'
import { AppConfig, DesktopAppConfig } from '@/typings/app'
import { safeJsonParse } from '@/utils/tool'

export interface FolderProps {
  apps: DesktopAppConfig[]
  emptyProps?: EmptyProps
}
const Folder: React.FC<FolderProps> = ({ apps, emptyProps }) => {
  return (
    <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none overflow-x-auto overflow-y-auto ub-scrollbar">
      {apps.length > 0 ? (
        <DragArea
          onDrop={(e) => {
            const data: AppConfig = safeJsonParse(
              e.dataTransfer.getData('custom'),
              {}
            )
            console.log(data)
          }}
          preventDropAction
          className="flex-grow flex flex-wrap items-start content-start justify-start"
        >
          {apps.map((app) => (
            <Draggable data={app} key={app.id}>
              <FolderApp app={app} />
            </Draggable>
          ))}
        </DragArea>
      ) : (
        <Empty title="Folder is Empty" {...emptyProps} />
      )}
    </div>
  )
}

export default Folder

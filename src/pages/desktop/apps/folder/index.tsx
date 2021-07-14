import React, { useMemo } from 'react'
import Empty, { EmptyProps } from './empty'
import FolderApp, { FolderDragData } from './folder-app'
import { DragArea } from '@/components/dragging'
import { safeJsonParse } from '@/utils/tool'
import { isFolder } from '@/utils/app'
import { useDesktopContext } from '../../provider'

export interface FolderProps {
  id: string
  emptyProps?: EmptyProps
}
const Folder: React.FC<FolderProps> = ({ id, emptyProps }) => {
  const [{ apps }] = useDesktopContext()
  const folderApps = useMemo(() => {
    const currentFolder = apps.find((app) => app.id === id)
    if (currentFolder && isFolder(currentFolder)) {
      return currentFolder.apps
    }
    return []
  }, [apps])
  return (
    <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none overflow-x-auto overflow-y-auto ub-scrollbar">
      <DragArea
        onDrop={(e) => {
          const data: FolderDragData = safeJsonParse(
            e.dataTransfer.getData('custom'),
            {}
          )
        }}
        preventDropAction
        className="min-h-full flex-grow flex flex-wrap items-start content-start justify-start"
      >
        {folderApps.length > 0 ? (
          folderApps.map((app) => (
            <FolderApp folderId={id} key={app.id} app={app} />
          ))
        ) : (
          <Empty title="Folder is Empty" {...emptyProps} />
        )}
      </DragArea>
    </div>
  )
}

export default Folder

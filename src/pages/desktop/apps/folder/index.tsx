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
  const [{ appMap }, desktopMethods] = useDesktopContext()
  const folderApps = useMemo(() => {
    const currentFolder = appMap[id]
    if (isFolder(currentFolder)) {
      return currentFolder.apps.map((app) => appMap[app.id])
    }
    return []
  }, [appMap])
  return (
    <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none overflow-x-auto overflow-y-auto ub-scrollbar">
      <DragArea
        onDrop={(e) => {
          const data: FolderDragData & {
            position: {
              left: number
              top: number
            }
            rect: {
              width: number
              height: number
            }
          } = safeJsonParse(e.dataTransfer.getData('custom'), {})
          const target = e.currentTarget as HTMLDivElement
          function getDisTop(element) {
            // 获取元素距离页面顶部的距离
            let realTop = element.offsetTop
            let parent = element.offsetParent
            while (parent !== null) {
              realTop += parent.offsetTop
              parent = parent.offsetParent
            }
            return realTop
          }
          console.log(getDisTop(target))
          desktopMethods.updateFolderApp({
            from: data.from,
            to: id,
            data: {
              ...data.app,
              position: {
                left: e.clientX,
                top: e.clientY,
              },
            },
          })
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

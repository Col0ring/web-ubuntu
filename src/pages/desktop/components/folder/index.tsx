import React, { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import Empty, { EmptyProps } from './empty'
import FolderApp, { FolderAppProps, FolderDragData } from './folder-app'
import { DragArea } from '@/components/dragging'
import { getOffsetWindow, safeJsonParse } from '@/utils/tool'
import { isFolder } from '@/utils/app'
import { useDesktopContext } from '../../provider'

export interface FolderProps {
  id: string
  emptyProps?: EmptyProps
  showEmpty?: boolean
  wrapperClassName?: string
  className?: string
}
const Folder: React.FC<FolderProps> = ({
  id,
  emptyProps,
  showEmpty = true,
  wrapperClassName,
  className,
}) => {
  const [{ appMap }, desktopMethods] = useDesktopContext()
  const folderApps = useMemo(() => {
    const currentFolder = appMap[id]
    if (isFolder(currentFolder)) {
      return currentFolder.apps.map((app) => appMap[app.id])
    }
    return []
  }, [appMap])
  const onAppOpen: Required<FolderAppProps>['onOpen'] = useCallback(
    (appId, app) => {
      desktopMethods.openApp(appId, app)
    },
    [desktopMethods]
  )
  const folderWrapperClassName = classnames('w-full h-full', wrapperClassName)
  return (
    <div className={folderWrapperClassName}>
      <DragArea
        onDrop={(e) => {
          const data: FolderDragData = safeJsonParse(
            e.dataTransfer.getData('custom'),
            {}
          )
          if (!data.app) {
            return
          }
          const app = appMap[data.app.id]
          const domOffset: {
            left: number
            top: number
          } = safeJsonParse(e.dataTransfer.getData('domOffset'), {})
          const target = e.currentTarget as HTMLDivElement
          const { offsetLeft, offsetTop } = getOffsetWindow(target)
          const position =
            data.from === id
              ? app.position
              : {
                  left: e.clientX - offsetLeft - domOffset.left,
                  top: e.clientY - offsetTop - domOffset.top,
                }
          desktopMethods.updateFolderApp({
            from: data.from,
            to: id,
            data: {
              ...app,
              position,
            },
          })
        }}
        preventDropAction
        className={className}
      >
        {folderApps.length > 0 || !showEmpty ? (
          folderApps.map((app) => (
            <FolderApp
              onOpen={onAppOpen}
              folderId={id}
              key={app.id}
              app={app}
            />
          ))
        ) : (
          <Empty title="Folder is Empty" {...emptyProps} />
        )}
      </DragArea>
    </div>
  )
}

export default Folder

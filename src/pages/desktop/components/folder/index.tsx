import React, { useCallback, useMemo } from 'react'
import classnames from 'classnames'
import Empty, { EmptyProps } from './empty'
import FolderApp, { FolderAppProps, FolderDragData } from './folder-app'
import { DragArea } from '@/components/dragging'
import { getOffsetWindow, safeJsonParse } from '@/utils/misc'
import { isFolder } from '../../util'
import { useDesktopContext } from '../../provider'
import { setFolderDragTarget } from './store'
import FolderContextmenu from './folder-context-menu'
import message from '@/components/message'

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
  const [{ appMap, copiedAppId }, desktopMethods] = useDesktopContext()
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

  const onAppCopy: Required<FolderAppProps>['onCopy'] = useCallback(
    (appId) => {
      desktopMethods.setCopiedAppId(appId)
    },
    [desktopMethods]
  )

  const onAppPaste: Required<FolderAppProps>['onPaste'] = useCallback(
    (appId) => {
      const copiedApp = appMap[copiedAppId]
      const currentApp = appMap[appId]
      if (!copiedApp) {
        return
      }
      if (!isFolder(currentApp)) {
        message.error({
          content: 'target app is not a folder',
        })
        return
      }
      desktopMethods.updateFolderApp({
        from: copiedApp.parentId,
        to: appId,
        data: {
          ...copiedApp,
          position: {
            left: 0,
            top: 0,
          },
        },
      })
    },
    [desktopMethods, copiedAppId, appMap]
  )

  const folderWrapperClassName = classnames('w-full h-full', wrapperClassName)
  return (
    <FolderContextmenu folderId={id} className={folderWrapperClassName}>
      <DragArea
        onDragEnter={() => {
          setFolderDragTarget(id)
        }}
        onDrop={(e) => {
          e.stopPropagation()
          const data: FolderDragData = safeJsonParse(
            e.dataTransfer.getData('custom'),
            {}
          )
          // no app
          if (!data.app) {
            message.error({
              content: 'invalid dragging element',
            })
            return
          }

          // drag to its parent
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
        className={className}
      >
        {folderApps.length > 0 || !showEmpty ? (
          folderApps.map((app) => (
            <FolderApp
              onOpen={onAppOpen}
              onCopy={onAppCopy}
              onPaste={onAppPaste}
              folderId={id}
              key={app.id}
              app={app}
            />
          ))
        ) : (
          <Empty title="Folder is Empty" {...emptyProps} />
        )}
      </DragArea>
    </FolderContextmenu>
  )
}

export default Folder

import React, { useCallback, useMemo, useRef } from 'react'
import classnames from 'classnames'
import Empty, { EmptyProps } from './empty'
import FolderApp, { FolderAppProps, FolderDragData } from './folder-app'
import { DragArea } from '@/components/dragging'
import { getOffsetWindow, safeJsonParse } from '@/utils/misc'
import { getMousePosition, isFolder } from '../../util'
import { useDesktopContext } from '../../provider'
import { setFolderDragTarget } from './store'
import FolderContextmenu, {
  FolderContextmenuProps,
} from './folder-context-menu'
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
  const folderRef = useRef<HTMLDivElement>(null)
  const folderApps = useMemo(() => {
    const currentFolder = appMap[id]
    if (isFolder(currentFolder)) {
      return currentFolder.apps.map((app) => appMap[app.id])
    }
    return []
  }, [appMap, id])
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

  const onAppPaste: Required<FolderContextmenuProps>['onPaste'] = useCallback(
    (appId, app, isInFolder) => {
      const copiedApp = appMap[copiedAppId]
      const currentApp = appMap[appId]
      if (!copiedApp || !folderRef.current) {
        return
      }
      if (!isFolder(currentApp)) {
        message.error({
          content: 'target app is not a folder',
        })
        return
      }

      const { x, y } = getMousePosition()
      const { offsetTop, offsetLeft } = getOffsetWindow(folderRef.current)

      desktopMethods.pasteFolderApp({
        parentId: appId,
        copiedId: copiedAppId,
        position: isInFolder
          ? {
              left: x - offsetLeft,
              top: y - offsetTop,
            }
          : {
              left: 0,
              top: 0,
            },
      })
    },
    [desktopMethods, copiedAppId, appMap]
  )

  const folderWrapperClassName = classnames('w-full h-full', wrapperClassName)
  return (
    <div
      ref={folderRef}
      tabIndex={0}
      data-appid={id}
      className={folderWrapperClassName}
    >
      <FolderContextmenu onPaste={onAppPaste} folderId={id}>
        <DragArea
          onDragEnter={() => {
            setFolderDragTarget(id)
          }}
          onDrop={(e) => {
            e.stopPropagation()
            const data = safeJsonParse(
              e.dataTransfer.getData('custom'),
              {} as FolderDragData
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
            const domOffset = safeJsonParse(
              e.dataTransfer.getData('domOffset'),
              {} as {
                left: number
                top: number
              }
            )
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
            folderApps.map((app, index) => (
              <FolderApp
                onOpen={onAppOpen}
                onCopy={onAppCopy}
                onPaste={onAppPaste}
                folderId={id}
                key={app.id}
                app={app}
                index={index}
              />
            ))
          ) : (
            <Empty title="Folder is Empty" {...emptyProps} />
          )}
        </DragArea>
      </FolderContextmenu>
    </div>
  )
}

export default Folder

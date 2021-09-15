import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { getOffsetWindow, getParentNode } from '@/utils/tool'
import { dataTarget } from '../../config'
import { useDesktopContext } from '../../provider'
import { SpecialFolder } from '../../constants'

export interface FolderContextmenuProps {
  className?: string
  folderId: string
}
const FolderContextmenu: React.FC<FolderContextmenuProps> = ({
  children,
  folderId,
  className,
}) => {
  const [{ appMap }, desktopMethods] = useDesktopContext()
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  })
  const folderContextmenu = classnames(
    className,
    'h-full w-full flex flex-col justify-start content-start flex-wrap bg-transparent relative overflow-hidden overscroll-none'
  )
  const menus = useMemo(() => {
    return [
      {
        key: 'New Folder',
        title: 'New Folder',
        onClick() {
          desktopMethods.setNewFolderModalFolderId(folderId)
          desktopMethods.setNewFolderModal(true)
        },
      },
      {
        key: 'Paste',
        title: 'Paste',
        disabled: true,
      },
      {
        key: 'Show Desktop in Files',
        title: 'Show Desktop in Files',
        disabled: true,
      },
      {
        key: 'Open in Terminal',
        title: 'Open in Terminal',
      },
      {
        key: 'Change Background...',
        title: 'Change Background...',
        onClick() {
          const settings = appMap[SpecialFolder.Settings]
          settings && desktopMethods.openApp(settings.id, settings)
        },
      },
      {
        key: 'Display Settings',
        title: 'Display Settings',
        disabled: true,
      },
      {
        key: 'Settings',
        title: 'Settings',
        onClick() {
          const settings = appMap[SpecialFolder.Settings]
          settings && desktopMethods.openApp(settings.id, settings)
        },
      },
    ] as ContextmenuProps['menus']
  }, [])
  const rewriteOptions: Required<ContextmenuProps>['contextmenuOptionsRewrite'] =
    useMemo(() => {
      return {
        onContextMenu(e) {
          if (
            getParentNode(e.target as HTMLElement, (node) => {
              const target = (node as HTMLDivElement).dataset?.target
              return (
                target === dataTarget.folderApp ||
                target === dataTarget.sidebarApp
              )
            })
          ) {
            return setVisible(false)
          }
          setVisible(true)
          desktopMethods.setMousePosition({
            clientX: e.clientX,
            clientY: e.clientY,
          })
          const target = e.currentTarget as HTMLElement
          const { offsetLeft, offsetTop } = getOffsetWindow(target)
          const leftPosition = e.clientX - offsetLeft
          const topPosition = e.clientY - offsetTop
          setPosition({
            left: leftPosition,
            top: topPosition,
          })
        },
        onClick() {
          setVisible(false)
        },
        onClickAway() {
          setVisible(false)
        },
      }
    }, [setVisible, setPosition, desktopMethods])
  return (
    <Contextmenu
      rewritePosition={position}
      rewriteVisible={visible}
      contextmenuOptionsRewrite={rewriteOptions}
      className={folderContextmenu}
      menus={menus}
    >
      {children}
    </Contextmenu>
  )
}

export default FolderContextmenu

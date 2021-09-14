import React, { useMemo, useState } from 'react'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { getParentNode } from '@/utils/tool'
import { dataTarget } from '../config'
import { useDesktopContext } from '../provider'
import { SpecialFolder } from '../constants'

const DesktopContextmenu: React.FC = ({ children }) => {
  const [{ appMap }, desktopMethods] = useDesktopContext()
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  })
  const menus = useMemo(() => {
    return [
      {
        key: 'New Folder',
        title: 'New Folder',
        onClick() {
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
          const { left, top } = (
            e.currentTarget as HTMLElement
          ).getBoundingClientRect()
          const leftPosition = e.clientX - left
          const topPosition = e.clientY - top
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
      className="h-full w-full flex flex-col justify-start content-start flex-wrap  pt-8 bg-transparent relative overflow-hidden overscroll-none"
      menus={menus}
    >
      {children}
    </Contextmenu>
  )
}

export default DesktopContextmenu

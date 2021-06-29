import React, { useMemo, useState } from 'react'
import Contextmenu, { ContextmenuProps } from '@/components/contextmenu'
import { getParentNode } from '@/utils/tool'
import { dataTarget } from '../config'
const DesktopContextmenu: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  })
  const menus = useMemo(() => {
    return [
      {
        key: 'New Folder',
        title: 'New Folder'
      },
      {
        key: 'Paste',
        title: 'Paste',
        disabled: true
      },
      {
        key: 'Show Desktop in Files',
        title: 'Show Desktop in Files',
        disabled: true
      },
      {
        key: 'Open in Terminal',
        title: 'Open in Terminal'
      },
      {
        key: 'Change Background...',
        title: 'Change Background...'
      },
      {
        key: 'Display Settings',
        title: 'Display Settings',
        disabled: true
      },
      {
        key: 'Settings',
        title: 'Settings'
      }
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
                target === dataTarget.desktopApp ||
                target === dataTarget.sidebarApp
              )
            })
          ) {
            return setVisible(false)
          }
          setVisible(true)
          let { left, top } = (
            e.currentTarget as HTMLElement
          ).getBoundingClientRect()
          let leftPosition = e.clientX - left
          let topPosition = e.clientY - top
          if (leftPosition + 200 > window.innerWidth) {
            leftPosition = window.innerWidth - 200
          }
          if (topPosition + 600 > window.innerWidth) {
            topPosition = window.innerHeight - 300
          }
          setPosition({
            left: leftPosition,
            top: topPosition
          })
        },
        onClick() {
          setVisible(false)
        },
        onClickAway() {
          setVisible(false)
        }
      }
    }, [setVisible, setPosition])
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

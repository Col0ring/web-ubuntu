import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import useContextmenu, {
  useContextmenuOptions,
} from '@/hooks/common/useContextmenu'
import { getOffsetWindow } from '@/utils/misc'
import Divider from './divider'
import './style.less'

export interface MenuItemOptions {
  onClick?: (e: React.MouseEvent) => void
  icon?: React.ReactNode
  disabled?: boolean
  key: string
  render?: () => React.ReactNode
  title?: React.ReactNode
}

export interface ContextmenuProps {
  className?: string
  nodeRef?: React.RefObject<HTMLDivElement>
  menus: MenuItemOptions[]
  rewriteVisible?: boolean
  rewritePosition?: {
    left: number
    top: number
  }
  onItemClick?: (key: string, e: React.MouseEvent) => void
  contextmenuOptionsRewrite?: useContextmenuOptions
}

const Contextmenu: React.FC<ContextmenuProps> = ({
  children,
  className,
  menus,
  nodeRef,
  onItemClick,
  contextmenuOptionsRewrite,
  rewriteVisible,
  rewritePosition,
}) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  })
  const [visible, setVisible] = useState(false)
  const contextmenuRef = useRef<HTMLDivElement | null>(null)
  const ref = nodeRef || contextmenuRef
  const contextmenuClassName = classnames('relative', className)
  // note: level 2 events are triggered before level 0 events，we need to use level 0 event
  const { onClick: onRewriteClick, ...optionsRewrite } =
    contextmenuOptionsRewrite || {}
  const onMenuClick =
    onRewriteClick ||
    (() => {
      setVisible(false)
    })
  useContextmenu(
    ref,
    contextmenuOptionsRewrite
      ? optionsRewrite
      : {
          onContextMenu(e) {
            setVisible(true)
            const target = e.currentTarget as HTMLElement
            const { offsetLeft, offsetTop } = getOffsetWindow(target)
            setPosition({
              left: e.clientX - offsetLeft,
              top: e.clientY - offsetTop,
            })
          },
          onClickAway() {
            setVisible(false)
          },
        }
  )

  return (
    <div
      ref={ref}
      onClick={
        onMenuClick as unknown as React.MouseEventHandler<HTMLDivElement>
      }
      className={contextmenuClassName}
    >
      {children}
      {(rewriteVisible || visible) && (
        <div
          className="context-menu-bg whitespace-nowrap border font-light border-gray-900 rounded text-white py-4 absolute text-sm"
          style={{
            zIndex: 100000,
            left: rewritePosition?.left || position.left,
            top: rewritePosition?.top || position.top,
          }}
        >
          {menus.map(({ key, title, render, onClick, icon, disabled }) => {
            return (
              <div
                key={key}
                onClick={(e) => {
                  if (!disabled) {
                    onClick?.(e)
                    onItemClick?.(key, e)
                  }
                }}
              >
                {render ? (
                  render()
                ) : (
                  <div
                    className={`px-6 py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5 ${
                      disabled ? 'text-gray-400' : ''
                    }`}
                  >
                    {icon}
                    <span>{title}</span>
                  </div>
                )}
                <Divider />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Contextmenu

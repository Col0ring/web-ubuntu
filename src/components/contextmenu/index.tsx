import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import useContextmenu, {
  useContextOptions
} from '@/hooks/common/useContextmenu'
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
  menus: MenuItemOptions[]
  rewriteVisible?: boolean
  rewritePosition?: {
    left: number
    top: number
  }
  onItemClick?: (key: string, e: React.MouseEvent) => void
  contextmenuOptionsRewrite?: useContextOptions
}

const Contextmenu: React.FC<ContextmenuProps> = ({
  children,
  className,
  menus,
  onItemClick,
  contextmenuOptionsRewrite,
  rewriteVisible,
  rewritePosition
}) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  })
  const [visible, setVisible] = useState(false)
  const contextmenuRef = useRef<HTMLDivElement | null>(null)
  const contextmenuClassName = classnames('relative', className)

  useContextmenu(
    contextmenuRef,
    contextmenuOptionsRewrite
      ? contextmenuOptionsRewrite
      : {
          onContextMenu(e) {
            setVisible(true)
            const { left, top } = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect()
            setPosition({
              left: e.clientX - left,
              top: e.clientY - top
            })
          },
          onClick() {
            setVisible(false)
          },
          onClickAway() {
            setVisible(false)
          }
        }
  )

  return (
    <div ref={contextmenuRef} className={contextmenuClassName}>
      {children}
      {(rewriteVisible || visible) && (
        <div
          className="context-menu-bg whitespace-nowrap border font-light border-gray-900 rounded text-white py-4 absolute text-sm"
          style={{
            zIndex: 100000,
            left: rewritePosition?.left || position.left,
            top: rewritePosition?.top || position.top
          }}
        >
          {menus.map(
            ({ key, title, render, onClick, icon, disabled }, index) => {
              return (
                <div
                  key={key}
                  onClick={(e) => {
                    onClick?.(e)
                    onItemClick?.(key, e)
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
                      <span>{title}</span>
                    </div>
                  )}
                  <Divider />
                </div>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}

export default Contextmenu

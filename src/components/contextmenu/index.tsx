import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import useContextmenu from '@/hooks/common/useContextmenu'
import Divider from './divider'

export interface MenuItemOptions {
  onClick?: (e: React.MouseEvent) => void
  icon?: React.ReactNode
  key: string
  render?: () => React.ReactNode
  title?: React.ReactNode
}

export interface ContextmenuProps {
  className?: string
  menus: MenuItemOptions[]
  onItemClick?: (key: string, e: React.MouseEvent) => void
}

const Contextmenu: React.FC<ContextmenuProps> = ({
  children,
  className,
  menus,
  onItemClick
}) => {
  const [position, setPosition] = useState({
    left: 0,
    top: 0
  })
  const [visible, setVisible] = useState(false)
  const contextmenuRef = useRef<HTMLDivElement | null>(null)
  const contextmenuClassName = classnames('relative', className)

  useContextmenu(contextmenuRef, {
    onClick(e) {
      setVisible(true)
      let left = 0
      if (e.clientX + 140 > window.innerWidth) {
        left = e.clientX - 152
      } else {
        left = e.clientX + 12
      }
      setPosition({
        left,
        top: e.clientY + 10
      })
    },
    onClickAway() {
      setVisible(false)
    }
  })

  return (
    <div ref={contextmenuRef} className={contextmenuClassName}>
      {children}
      {visible && (
        <div
          className="absolute"
          style={{
            zIndex: 100000,
            left: position.left,
            top: position.top
          }}
        >
          {menus.map(({ key, title, render, onClick, icon }) => {
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
                  <div className="flex justify-between items-center text-white bg-ub-cool-grey">
                    <div className="flex justify-center items-center w-8 h-8">
                      {icon}
                    </div>
                    <div className="flex-1 px-3">{title}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Contextmenu

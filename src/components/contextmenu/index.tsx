import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import useContextmenu from '@/hooks/common/useContextmenu'
import Divider from './divider'
import './style.less'

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
      const { left, top } = (
        e.currentTarget as HTMLElement
      ).getBoundingClientRect()
      setPosition({
        left: e.clientX - left,
        top: e.clientY - top
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
          className="w-52 context-menu-bg border text-left font-light border-gray-900 rounded text-white py-4 absolute text-sm"
          style={{
            zIndex: 100000,
            left: position.left,
            top: position.top
          }}
        >
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
            <span className="ml-5">New Folder</span>
          </div>
          <Divider />
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5 text-gray-400">
            <span className="ml-5">Paste</span>
          </div>
          <Divider />
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5 text-gray-400">
            <span className="ml-5">Show Desktop in Files</span>
          </div>
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
            <span className="ml-5">Open in Terminal</span>
          </div>
          <Divider />
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
            <span className="ml-5">Change Background...</span>
          </div>
          <Divider />
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5 text-gray-400">
            <span className="ml-5">Display Settings</span>
          </div>
          <div className="w-full py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
            <span className="ml-5">Settings</span>
          </div>
          {menus.map(({ key, title, render, onClick, icon }) => {
            return (
              <div
                key={key}
                onClick={(e) => {
                  onClick?.(e)
                  onItemClick?.(key, e)
                }}
              >
                {render ? render() : <div></div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Contextmenu

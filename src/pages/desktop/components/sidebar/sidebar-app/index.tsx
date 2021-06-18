import React, { useCallback, useRef, useState } from 'react'
import classnames from 'classnames'
import Tooltip from '@/components/tooltip'
import useTimeoutFn from '@/hooks/common/useTimeoutFn'
import { AppConfig } from '@/typings/app'
import './style.less'
export interface SidebarAppProps {
  app: AppConfig
  isOpen?: boolean
  isMinimized?: boolean
  onClick?: (appId: string, app: AppConfig) => void
}

const SidebarApp: React.FC<SidebarAppProps> = ({
  onClick,
  isOpen,
  app,
  isMinimized
}) => {
  const sidebarAppRef = useRef<HTMLDivElement | null>(null)
  const [isScale, setIsScale] = useState(false)

  const { run: cancelScale } = useTimeoutFn(() => {
    setIsScale(false)
  }, 1000)

  const sidebarAppClassName = classnames(
    'w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded',
    {
      'bg-white bg-opacity-10': isOpen
    }
  )

  const onAppClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (!isMinimized && !isOpen) {
        setIsScale(true)
        cancelScale()
      }
      onClick?.(app.id, app)
    }, [onClick, app.id, app, isMinimized, isOpen])

  return (
    <Tooltip className="m-1" title={app.title}>
      <div
        // to focus
        tabIndex={0}
        ref={sidebarAppRef}
        onClick={onAppClick}
        className={sidebarAppClassName}
        id={`sidebar-app-${app.id}`}
      >
        <img className="w-7" src={app.icon} alt={app.title} />
        {isScale && (
          <img
            className="scalable-app-icon w-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            src={app.icon}
            alt={app.title}
          />
        )}
        {isOpen && (
          <div className="w-1 h-1 absolute left-0 top-1/2 bg-ub-orange rounded-sm"></div>
        )}
      </div>
    </Tooltip>
  )
}

export default SidebarApp

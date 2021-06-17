import React, { useCallback, useRef, useState } from 'react'
import classnames from 'classnames'
import useHover from '@/hooks/common/useHover'
import useTimeoutFn from '@/hooks/common/useTimeoutFn'
import { AppConfig } from '@/typings/app'
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
  const isHover = useHover(sidebarAppRef)

  const { run: cancelScale } = useTimeoutFn(() => {
    setIsScale(false)
  }, 1000)

  const sidebarAppClassName = classnames(
    'w-auto p-2 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded m-1',
    {
      'bg-white bg-opacity-10': isOpen || isHover
    }
  )

  const onAppClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (!isMinimized && !isOpen) {
        setIsScale(true)
        cancelScale()
      }
      onClick?.(app.id, app)
    }, [onClick, app.id, app])

  return (
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
      {isHover && (
        <div className="w-max py-0.5 px-1.5 absolute top-1.5 left-full ml-3 m-1 text-ubt-grey text-opacity-90 text-sm bg-ub-grey bg-opacity-70 border-gray-400 border border-opacity-40 rounded-md">
          {app.title}
        </div>
      )}
    </div>
  )
}

export default SidebarApp
